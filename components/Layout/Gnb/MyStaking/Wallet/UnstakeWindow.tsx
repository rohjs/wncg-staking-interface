import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import {
  cooldownWindowAtom,
  unstakeTimestampsAtom,
  withdrawWindowAtom,
} from 'states/account'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { formatISO } from 'utils/formatISO'
import { joinCountdown } from 'utils/joinCountdown'
import { useCountdown, useModal, useStaking } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledWalletUnstakeWindow } from './styled'

type WalletUnstakeWindowProps = {
  closeWallet(): void
}

export default function WalletUnstakeWindow({
  closeWallet,
}: WalletUnstakeWindowProps) {
  const { cooldownPeriod } = useStaking()

  const cooldownWindow = useAtomValue(cooldownWindowAtom)
  const withdrawWindow = useAtomValue(withdrawWindowAtom)
  const unstakeTimestamps = useAtomValue(unstakeTimestampsAtom)

  const { stakedTokenBalance = '0' } = useFetchUserData().data ?? {}
  const hasStakedLp = bnum(stakedTokenBalance).gt(0)

  const { addModal } = useModal()

  const period = useMemo(
    () => (cooldownWindow ? 'Cooldown' : 'Withdraw'),
    [cooldownWindow]
  )

  const expiresAt = useMemo(
    () =>
      (cooldownWindow
        ? unstakeTimestamps?.cooldownEndsAt
        : unstakeTimestamps?.withdrawEndsAt) ?? 0,
    [
      cooldownWindow,
      unstakeTimestamps?.cooldownEndsAt,
      unstakeTimestamps?.withdrawEndsAt,
    ]
  )

  const { days, hours, minutes, seconds } = useCountdown(expiresAt, {
    enabled: expiresAt > 0,
    leadingZero: false,
  })

  const countdown = joinCountdown(days, hours, minutes, seconds, {
    abbr: true,
  })

  if (!unstakeTimestamps || !hasStakedLp) {
    return <StyledWalletUnstakeWindow>hi</StyledWalletUnstakeWindow>
  }

  function openUnstake() {
    addModal({
      type: ModalType.Unstake,
    })
    closeWallet()
  }

  const startsAt = cooldownWindow
    ? unstakeTimestamps.cooldownEndsAt - cooldownPeriod
    : unstakeTimestamps.cooldownEndsAt

  const endsAt = cooldownWindow
    ? unstakeTimestamps.cooldownEndsAt
    : unstakeTimestamps.withdrawEndsAt

  return (
    <StyledWalletUnstakeWindow
      $unstake={withdrawWindow}
      onClick={withdrawWindow ? openUnstake : undefined}
      role={withdrawWindow ? 'button' : undefined}
    >
      <h4 className="title">{period}</h4>

      <div className="content">
        <strong className="timer">
          {countdown} {countdown && 'left'}
        </strong>

        <div className="period">
          <time dateTime={formatISO(startsAt)}>{format(startsAt)}</time>
          <time dateTime={formatISO(endsAt)} className="hyphen">
            {format(endsAt)}
          </time>
        </div>
      </div>
    </StyledWalletUnstakeWindow>
  )
}
