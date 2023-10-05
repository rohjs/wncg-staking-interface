import dynamic from 'next/dynamic'
import type { UseFormSetValue } from 'react-hook-form'
import { motion } from 'framer-motion'

import { RemoveLiquidityField } from 'config/constants'
import { ANIMATION_MAP, EXIT_MOTION } from 'config/constants/motions'
import { joinCountdown } from 'utils/joinCountdown'
import { useCountdown } from 'hooks'
import type { RemoveLiquidityForm } from 'hooks/pancakeswap/useRemoveLiquidityForm'

type RemoveLiquidityModalPage1TimerProps = {
  setValue: UseFormSetValue<RemoveLiquidityForm>
  deadline?: number
  disabled?: boolean
}

function RemoveLiquidityModalPage1Timer({
  setValue,
  deadline = 0,
  disabled,
}: RemoveLiquidityModalPage1TimerProps) {
  const enabled = !!deadline
  const { days, hours, minutes, seconds } = useCountdown(deadline, {
    enabled,
    leadingZero: false,
    onExpiration() {
      setValue(RemoveLiquidityField.Signature, undefined)
    },
  })

  const countdownText = joinCountdown(days, hours, minutes, seconds)

  if (!deadline || !countdownText || disabled) {
    return (
      <motion.p
        {...EXIT_MOTION}
        className="desc"
        variants={ANIMATION_MAP.fadeIn}
      >
        Sign to exit, no transaction needed.
      </motion.p>
    )
  }

  return (
    <motion.p
      {...EXIT_MOTION}
      className="timer"
      variants={ANIMATION_MAP.fadeIn}
    >
      After <strong>{countdownText}</strong>, you need to sign again.
    </motion.p>
  )
}

export default dynamic(() => Promise.resolve(RemoveLiquidityModalPage1Timer), {
  ssr: false,
})
