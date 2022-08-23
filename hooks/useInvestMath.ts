import { useCallback, useMemo } from 'react'
import { useRecoilValue } from 'recoil'

import { getUserBalances } from 'app/states/balance'
import { poolState } from 'app/states/pool'
import CalculatorService from 'lib/calculator'
import { bnum } from 'utils/num'
import { useAppSelector } from './useRedux'

export function useInvestMath() {
  const pool = useRecoilValue(poolState)

  const userBalances = useAppSelector(getUserBalances)
  const bptBalance = userBalances.bpt

  const calculator = useMemo(() => {
    if (!pool) return null
    return new CalculatorService(pool, bptBalance, 'join')
  }, [bptBalance, pool])

  const getMinBptOut = useCallback(
    (amounts: string[]) => {
      return calculator?.exactTokensInForBptOut(amounts).toString() || '0'
    },
    [calculator]
  )

  const getPriceImpact = useCallback(
    (amounts: string[]) => {
      if (!hasAmounts(amounts)) return 0

      try {
        const fullBptOut = calculator?.exactTokensInForBptOut(amounts)

        return (
          calculator
            ?.priceImpact(amounts, {
              queryBpt: fullBptOut,
            })
            .toNumber() || 0
        )
      } catch (error) {
        return 1
      }
    },
    [calculator]
  )

  const getPropAmounts = useCallback(
    (amounts: string[], fixedTokenIndex: number) => {
      const index = fixedTokenIndex === 1 ? 0 : 1
      const { send } =
        calculator?.propAmountsGiven(amounts[index], index, 'send') || {}
      return send || ['0', '0']
    },
    [calculator]
  )

  return {
    getMinBptOut,
    getPriceImpact,
    getPropAmounts,
  }
}

function hasAmounts(amounts: string[]) {
  return amounts.some((amount) => bnum(amount).gt(0))
}
