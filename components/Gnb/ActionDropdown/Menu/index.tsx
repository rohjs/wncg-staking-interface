import { memo, useCallback, useRef } from 'react'
import { useMount, useUnmount } from 'react-use'
import { useAtomValue } from 'jotai'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { unstakePhaseAtom } from 'states/user'
import { slideInDown } from 'constants/motionVariants'
import { UnstakePhase } from 'constants/types'
import { useBalances, useModal } from 'hooks'

import { StyledActionDropdownMenu } from './styled'
import AvailableBalance from 'components/Balances/AvailableBalance'
import StakedBalance from 'components/Balances/StakedBalance'
import Button from 'components/Button'
import Rewards from './Rewards'
import UnstakeButton from './UnstakeButton'
import UnstakePeriod from './UnstakePeriod'

type ActionDropdownMenuProps = {
  close(): void
}

function ActionDropdownMenu({ close }: ActionDropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const { hasBptBalance } = useBalances()
  const { addModal } = useModal()

  const unstakePhase = useAtomValue(unstakePhaseAtom)
  const isUnstakeWindow = unstakePhase !== UnstakePhase.Idle

  function exit() {
    addModal({
      category: ModalCategory.Exit,
    })
    close()
  }

  const closeOnBlur = useCallback(
    (e: MouseEvent) => {
      if (!menuRef?.current?.contains(e.target as Node)) {
        close()
      }
    },
    [close]
  )

  useMount(() => {
    window.addEventListener('click', closeOnBlur, { passive: true })
  })

  useUnmount(() => {
    window.removeEventListener('click', closeOnBlur)
  })

  return (
    <StyledActionDropdownMenu
      className="actionDropdownMenu"
      ref={menuRef}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideInDown}
      aria-labelledby="actionDropdown"
      aria-orientation="vertical"
      role="menu"
    >
      <h3 className="a11y">Staking wallet</h3>

      <StakedBalance>
        <Rewards close={close} />
        <AnimatePresence>
          {isUnstakeWindow && <UnstakePeriod />}
        </AnimatePresence>
        <AnimatePresence>
          {!isUnstakeWindow && <UnstakeButton close={close} />}
        </AnimatePresence>
      </StakedBalance>

      <AvailableBalance>
        <Button
          className="actionButton"
          onClick={exit}
          disabled={!hasBptBalance}
          $variant="secondary"
          $size="md"
        >
          Exit pool
        </Button>
      </AvailableBalance>
    </StyledActionDropdownMenu>
  )
}

export default memo(ActionDropdownMenu)
