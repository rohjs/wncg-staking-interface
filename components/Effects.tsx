import { memo } from 'react'

import { useMediaQuery } from 'hooks'
import { usePool, usePrices, useStakingContractData } from 'hooks/contracts'

function Effects() {
  useMediaQuery()
  usePool()
  usePrices()
  useStakingContractData()

  return null
}

export default memo(Effects)
