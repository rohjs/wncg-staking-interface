import { memo, MouseEvent, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { appearInDown } from 'constants/motionVariants'
import { useAccount } from 'hooks'

import { StyledActionDropdown } from './styled'
import Menu from './Menu'
import Toggle from './Toggle'

function ActionDropdown() {
  const [show, setShow] = useState(false)

  const { isConnected } = useAccount()

  function close() {
    setShow(false)
  }

  function toggle(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    setShow((prev) => !prev)
  }

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledActionDropdown
          className="actionDropdown"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={appearInDown}
        >
          <AnimatePresence>{show && <Menu close={close} />}</AnimatePresence>

          <Toggle toggle={toggle} />
        </StyledActionDropdown>
      )}
    </AnimatePresence>
  )
}

export default memo(ActionDropdown)
