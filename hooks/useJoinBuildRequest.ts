import { useMemo } from 'react'
import { WeightedPoolEncoder } from '@balancer-labs/sdk'

import {
  NATIVE_CURRENCY_ADDRESS,
  ZERO_ADDRESS,
} from 'config/constants/addresses'
import { parseUnits } from 'utils/parseUnits'
import { useCalculator, useSlippage, useStaking } from 'hooks'

type UseJoinBuildRequestParams = {
  assets: Hash[]
  amounts: string[]
  joinInit?: boolean
}

export function useJoinBuildRequest({
  assets,
  amounts,
  joinInit,
}: UseJoinBuildRequestParams) {
  const calculator = useCalculator('join')
  const { minusSlippageScaled } = useSlippage()
  const { tokens } = useStaking()

  const joinTokenAddresses = useMemo(
    () =>
      assets.map((addr) => {
        if (addr !== NATIVE_CURRENCY_ADDRESS) return addr
        return ZERO_ADDRESS
      }),
    [assets]
  )

  const maxAmountsIn = useMemo(
    () =>
      amounts.map((amt, i) =>
        parseUnits(amt, tokens[assets[i]]?.decimals ?? 18).toString()
      ),
    [amounts, assets, tokens]
  )

  const minBptOut = useMemo(() => {
    const minBpt = calculator?.exactTokensInForBptOut(amounts).toString() ?? '0'
    return minusSlippageScaled(minBpt)
  }, [amounts, calculator, minusSlippageScaled])

  const request = useMemo(() => {
    const userData = joinInit
      ? WeightedPoolEncoder.joinInit(maxAmountsIn)
      : WeightedPoolEncoder.joinExactTokensInForBPTOut(maxAmountsIn, minBptOut)

    return {
      assets: joinTokenAddresses,
      maxAmountsIn,
      userData,
      fromInternalBalance: false,
    }
  }, [joinInit, joinTokenAddresses, maxAmountsIn, minBptOut])

  return request
}
