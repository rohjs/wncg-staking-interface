import { useCallback, useMemo } from 'react'

import { bnum } from 'utils/num'
import { useBalances as useFetchBalances } from './contracts'
import { useStaking } from './useStaking'

export function useBalances() {
  const balanceMap = useFetchBalances()
  const { stakedTokenAddress } = useStaking()

  const balanceFor = useCallback(
    (address?: string) => {
      return balanceMap[address?.toLowerCase() || ''] || '0'
    },
    [balanceMap]
  )

  const bptBalance = useMemo(
    () => balanceFor(stakedTokenAddress),
    [balanceFor, stakedTokenAddress]
  )

  const hasBptBalance = useMemo(() => bnum(bptBalance).gt(0), [bptBalance])

  return {
    balanceFor,
    bptBalance,
    hasBptBalance,
  }
}
