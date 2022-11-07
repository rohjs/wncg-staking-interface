import { memo } from 'react'

import { useAllowances, useBalances } from 'hooks/contracts'

function ContractEffects() {
  useAllowances()
  useBalances()

  return null
}

export default memo(ContractEffects)
