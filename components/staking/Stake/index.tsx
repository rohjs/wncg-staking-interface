import { memo } from 'react'
import { motion } from 'framer-motion'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { useFetchUserBalances } from 'hooks/queries'
import { useAuth } from 'hooks'

import { StyledStakingStake } from './styled'
import Suspense from 'components/Suspense'
import Connect from './Connect'
import Fallback from './Fallback'
import Form from './Form'
import Header from './Header'
import JoinButton from './JoinButton'

function StakingStake() {
  const { isConnected } = useAuth()
  const balanceMap = useFetchUserBalances().data ?? {}

  const isFetching = !!isConnected && Object.keys(balanceMap).length === 0

  return (
    <StyledStakingStake>
      <Header />

      {isFetching && <Fallback />}

      {!isFetching && (
        <motion.div
          {...MOTION}
          className="stakeGroup"
          variants={ANIMATION_MAP.fadeIn}
        >
          {isConnected === true && (
            <Suspense>
              <Form />
            </Suspense>
          )}

          {isConnected === false && <Connect />}

          <JoinButton />
        </motion.div>
      )}
    </StyledStakingStake>
  )
}

export default memo(StakingStake)
