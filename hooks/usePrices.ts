import { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { uniqAddress } from 'utils/address'
import { calcPoolTotalValue } from 'utils/calculator'
import { bnum } from 'utils/num'
import { usePool } from './usePool'
import { useStaking } from './useStaking'

export function usePrices() {
  const queryClient = useQueryClient()

  const { bptAddress, poolTokens, poolTokenAddresses, poolTotalShares } =
    usePool()
  const { rewardTokensList } = useStaking()

  const addresses = useMemo(
    () => uniqAddress([...poolTokenAddresses, ...rewardTokensList]),
    [poolTokenAddresses, rewardTokensList]
  )

  const tokenPrices = useMemo(() => {
    const list =
      queryClient.getQueryData<TokenPrices[]>(['tokenPrices', addresses]) ?? []
    return Object.fromEntries(list.flatMap((prices) => Object.entries(prices)))
  }, [addresses, queryClient])

  const bptPrice = useMemo(() => {
    if (!tokenPrices) return '0'
    return (
      bnum(calcPoolTotalValue(poolTokens, tokenPrices))
        .div(poolTotalShares)
        .toString() || '0'
    )
  }, [poolTokens, poolTotalShares, tokenPrices])

  const priceMap = useMemo(() => {
    if (!bptAddress) return tokenPrices
    return {
      ...tokenPrices,
      [bptAddress]: bptPrice,
    }
  }, [bptAddress, bptPrice, tokenPrices])

  const priceFor = useCallback(
    (address = '') => priceMap[address.toLowerCase()] || '0',
    [priceMap]
  )

  const invalidPriceError = useMemo(
    () => tokenPrices.isError,
    [tokenPrices.isError]
  )

  return {
    bptPrice,
    priceFor,
    invalidPriceError,
  }
}
