import { memo, useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { format, formatDistanceToNow } from 'date-fns'

import { ModalCategory } from 'states/ui'
import { roundedTimestampsAtom, unstakePhaseAtom } from 'states/user'
import { fadeIn } from 'constants/motionVariants'
import { UnstakePhase } from 'constants/types'
import { datetimePattern } from 'constants/time'
import { useModal } from 'hooks'

import { StyledActionDropdownMenuUnstakePeriod } from './styled'
import SvgIcon from 'components/SvgIcon'
import Timer from './Timer'
import { useTimestamps } from 'hooks/contracts'

function ActionDropdownMenuUnstakePeriod() {
  const { addModal } = useModal()
  const { data: [cooldownEndsAt, withdrawEndsAt] = [] } = useTimestamps()
  const [roundedCooldownEndsAt, roundedWithdrawEndsAt] = useAtomValue(
    roundedTimestampsAtom
  )
  const unstakePhase = useAtomValue(unstakePhaseAtom)

  const isWithdrawWindow = useMemo(
    () => unstakePhase === UnstakePhase.WithdrawWindow,
    [unstakePhase]
  )

  const endsAt = useMemo(
    () => (isWithdrawWindow ? withdrawEndsAt : cooldownEndsAt),
    [cooldownEndsAt, isWithdrawWindow, withdrawEndsAt]
  )

  const timeDistanceDesc = `Withdraw window ${
    isWithdrawWindow ? `ends` : `starts`
  } ${formatDistanceToNow(endsAt, { addSuffix: true })}`

  function withdraw() {
    if (isWithdrawWindow) return
    addModal({
      category: ModalCategory.Cooldown,
    })
  }

  return (
    <StyledActionDropdownMenuUnstakePeriod
      className="unstakePeriod"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      onClick={isWithdrawWindow ? withdraw : undefined}
      role={isWithdrawWindow ? 'button' : undefined}
      $active={isWithdrawWindow}
    >
      <header className="header">
        {!isWithdrawWindow && <SvgIcon icon="lock" />}
        <h3 className="title">
          {isWithdrawWindow ? 'Withdraw' : 'Cooldown'} period
        </h3>
      </header>

      <dl className="detailList" style={{ position: 'relative' }}>
        <div className="detailItem timeDistance">
          <dt className="a11y">Time left</dt>
          <dd aria-label={timeDistanceDesc}>
            <Timer expiresAt={endsAt} /> left
          </dd>
        </div>

        <div className="detailItem timePeriod">
          <dt className="a11y">Withdraw window starts at</dt>
          <dd>
            <time dateTime={roundedCooldownEndsAt.toString()}>
              {format(roundedCooldownEndsAt, datetimePattern)}
            </time>
          </dd>
          <dt className="a11y">Withdraw window ends at</dt>
          <dd className="tilde">
            <time dateTime={roundedWithdrawEndsAt.toString()}>
              {format(roundedWithdrawEndsAt, datetimePattern)}
            </time>
          </dd>
        </div>
      </dl>
    </StyledActionDropdownMenuUnstakePeriod>
  )
}

export default memo(ActionDropdownMenuUnstakePeriod)
