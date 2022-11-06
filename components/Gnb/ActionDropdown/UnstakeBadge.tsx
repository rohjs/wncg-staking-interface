import { memo } from 'react'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { unstakePhaseAtom } from 'states/user'
import { pop } from 'constants/motionVariants'
import { UnstakePhase } from 'constants/types'

import { StyledActionDropdownUnstakeBadge } from './styled'
import SvgIcon from 'components/SvgIcon'

function ActionDropdownUnstakeBadge() {
  const unstakePhase = useAtomValue(unstakePhaseAtom)

  return (
    <AnimatePresence>
      {unstakePhase !== UnstakePhase.Idle && (
        <StyledActionDropdownUnstakeBadge
          className="unstakeBadge"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pop}
          $active={unstakePhase === UnstakePhase.WithdrawWindow}
        >
          <SvgIcon className="unlock" icon="unlock" />
          <SvgIcon className="lock" icon="lock" />
        </StyledActionDropdownUnstakeBadge>
      )}
    </AnimatePresence>
  )
}

export default memo(ActionDropdownUnstakeBadge)
