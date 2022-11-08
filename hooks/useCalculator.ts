import { useMemo } from 'react'

import CalculatorService from 'services/calculator'
import { useBalances } from './useBalances'
import { usePool } from './usePool'

export function useCalculator(action: PoolAction) {
  const { bptBalance } = useBalances()
  const { poolStaticData, poolSwapFee, poolTokenBalances, poolTotalShares } =
    usePool()

  const calculator = useMemo(() => {
    if (!poolStaticData) return null

    return new CalculatorService(
      action,
      poolTokenBalances,
      bptBalance,
      poolStaticData,
      poolSwapFee,
      poolTotalShares
    )
  }, [
    action,
    bptBalance,
    poolStaticData,
    poolSwapFee,
    poolTokenBalances,
    poolTotalShares,
  ])

  return calculator
}
