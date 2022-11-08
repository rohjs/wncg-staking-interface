import { memo, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'

import { ModalCategory } from 'states/ui'
import { fadeIn } from 'constants/motionVariants'
import { useAccount, useModal } from 'hooks'

import { StyledClaim } from './styled'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Rewards from './Rewards'

function Claim() {
  const { isConnected } = useAccount()
  const { addModal } = useModal()

  function claim() {
    addModal({
      category: ModalCategory.ClaimReward,
    })
  }

  return (
    <AnimatePresence>
      {isConnected && (
        <StyledClaim
          className="claim"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeIn}
        >
          <Suspense fallback={<Loading>CLAIM REWARDS LOADING</Loading>}>
            <Rewards />
          </Suspense>

          <Button className="claimButton" onClick={claim} $variant="tiny">
            Claim rewards
          </Button>
        </StyledClaim>
      )}
    </AnimatePresence>
  )
}

export default memo(Claim)
