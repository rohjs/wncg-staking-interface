import { motion } from 'framer-motion'

import { ANIMATION_MAP, MOTION } from 'config/constants/motions'
import { useResponsive } from 'hooks'

import { StyledStakeFallback } from './styled'
import Skeleton from 'components/Skeleton'

export default function StakingStakeFallback() {
  const { isMobile } = useResponsive()

  if (isMobile)
    return (
      <motion.div
        className="stakeGroup"
        {...MOTION}
        variants={ANIMATION_MAP.fadeIn}
        style={{ width: '100%' }}
      >
        <Skeleton $width="100%" $height={64} />

        <Skeleton $width="100%" $height={20 - 2} $mt={8 + 2} />

        <Skeleton $width="100%" $height={48} $mt={16} />
      </motion.div>
    )

  return (
    <StyledStakeFallback
      {...MOTION}
      className="stakeGroup"
      variants={ANIMATION_MAP.fadeIn}
      style={{ width: '100%' }}
    >
      <div className="group">
        <Skeleton $width="100%" $height={72} />

        <Skeleton $width="100%" $height={20 - 2} $mt={8 + 2} />
      </div>
      <Skeleton className="submitButton" $height={72} $ml={16} />
    </StyledStakeFallback>
  )
}
