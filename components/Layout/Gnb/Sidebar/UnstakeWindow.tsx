import { MouseEvent, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { formatISO } from 'date-fns'

import {
  cooldownWindowAtom,
  unstakeTimestampsAtom,
  withdrawWindowAtom,
} from 'states/account'
import { ModalType } from 'config/constants'
import { bnum } from 'utils/bnum'
import { format } from 'utils/format'
import { joinCountdown } from 'utils/joinCountdown'
import { useCountdown, useModal } from 'hooks'
import { useFetchUserData } from 'hooks/queries'

import { StyledWalletUnstakeWindow } from './styled'

type WalletUnstakeWindowProps = {
  closeSidebar(e: MouseEvent): void
}

export default function WalletUnstakeWindow({
  closeSidebar,
}: WalletUnstakeWindowProps) {
  const cooldownWindow = useAtomValue(cooldownWindowAtom)
  const unstakeWindow = useAtomValue(withdrawWindowAtom)
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
    return null
  }

  function openUnstake(e: MouseEvent) {
    addModal({
      type: ModalType.Unstake,
    })
    closeSidebar(e)
  }

  return (
    <StyledWalletUnstakeWindow
      $unstake={unstakeWindow}
      onClick={unstakeWindow ? openUnstake : undefined}
      role={unstakeWindow ? 'button' : undefined}
    >
      <h4 className="title">{period}</h4>

      <div className="content">
        <strong className="timer">
          {countdown} {countdown && 'left'}
        </strong>

        <div className="period">
          <time dateTime={formatISO(unstakeTimestamps!.cooldownEndsAt)}>
            {format(unstakeTimestamps!.cooldownEndsAt)}
          </time>
          <time
            dateTime={formatISO(unstakeTimestamps!.withdrawEndsAt)}
            className="tilde"
          >
            {format(unstakeTimestamps!.withdrawEndsAt)}
          </time>
        </div>
      </div>
    </StyledWalletUnstakeWindow>
  )
}