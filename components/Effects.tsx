import { memo } from 'react'

import { useMediaQuery } from 'hooks'
import { useStakingContractData } from 'hooks/contracts'

function Effects() {
  useMediaQuery()
  useStakingContractData()

  return null
}

export default memo(Effects)
