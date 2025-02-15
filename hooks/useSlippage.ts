import { useCallback } from 'react'
import { useAtomValue } from 'jotai'

import BigNumber from 'bignumber.js'

import { slippageAtom } from 'states/userSettings'
import { bnum } from 'utils/bnum'
import { parseUnits } from 'utils/parseUnits'
import { formatUnits } from 'utils/formatUnits'

export function useSlippage() {
  const slippage = useAtomValue(slippageAtom)
  const slippageBasisPoints = bnum(slippage || 0)
    .div(100)
    .toNumber()

  const addSlippageScaled = useCallback(
    (amount: string) => {
      const delta = bnum(amount)
        .times(slippageBasisPoints)
        .dp(0, BigNumber.ROUND_DOWN)
      return bnum(amount).plus(delta).toString()
    },
    [slippageBasisPoints]
  )

  const addSlippage = useCallback(
    (_amount: string, decimals: number) => {
      let amount = parseUnits(_amount, decimals).toString()
      amount = addSlippageScaled(amount)
      return formatUnits(amount, decimals)
    },
    [addSlippageScaled]
  )

  const minusSlippageScaled = useCallback(
    (amount: string) => {
      const delta = bnum(amount)
        .times(slippageBasisPoints)
        .dp(0, BigNumber.ROUND_UP)
      return bnum(amount).minus(delta).toString()
    },
    [slippageBasisPoints]
  )

  const minusSlippage = useCallback(
    (_amount: string, decimals: number) => {
      let amount = parseUnits(_amount, decimals).toString()
      amount = minusSlippageScaled(amount)
      return formatUnits(amount, decimals)
    },
    [minusSlippageScaled]
  )

  return {
    addSlippage,
    addSlippageScaled,
    minusSlippage,
    minusSlippageScaled,
  }
}
