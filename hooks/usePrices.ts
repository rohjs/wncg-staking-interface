import { useCallback, useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { fetchTokenPrices } from 'lib/coingecko'
import { fetchCoinmarketCapTokenPrice } from 'lib/coinmarketCap'
import { uniqAddress } from 'utils/address'
import { calcPoolTotalValue } from 'utils/calculator'
import { bnum } from 'utils/num'
import { usePool } from './usePool'
import { useStaking } from './useStaking'

const options = {
  retry: false,
  staleTime: 60 * 1_000,
}

export function usePrices() {
  const queryClient = useQueryClient()

  const { bptAddress, poolTokenAddresses, poolTokens, poolTotalShares } =
    usePool()
  const { rewardTokensList } = useStaking()

  const addresses = useMemo(
    () => uniqAddress([...poolTokenAddresses, ...rewardTokensList]),
    [poolTokenAddresses, rewardTokensList]
  )

  // const fallbackTokenPrices = useQuery(
  //   ['fallbackTokenPrices'],
  //   fetchCoinmarketCapTokenPrice,
  //   {
  //     retry: false,
  //     staleTime: Infinity,
  //     placeholderData: TOKEN_PRICES_PLACEHOLDERS,
  //   }
  // )

  const tokenPrices = useQuery<TokenPrices>(
    ['tokenPrices', addresses],
    () => fetchTokenPrices(addresses),
    {
      ...options,
      onError() {
        const state =
          queryClient.getQueryData<TokenPrices>(['fallbackTokenPrices']) ||
          TOKEN_PRICES_PLACEHOLDERS
        queryClient.setQueryData(['tokenPrices', addresses], state)
      },
    }
  )

  console.log(33, 'TOKEN PRICE STATUS', tokenPrices.status)

  const bptPrice = useMemo(() => {
    if (!tokenPrices.data) return '0'
    return bnum(calcPoolTotalValue(poolTokens, tokenPrices.data))
      .div(poolTotalShares)
      .toString()
  }, [poolTokens, poolTotalShares, tokenPrices.data])

  const priceMap = useMemo(() => {
    const map = tokenPrices.data ?? {}
    if (!bptAddress) return map
    return {
      ...map,
      [bptAddress]: bptPrice,
    }
  }, [bptAddress, bptPrice, tokenPrices.data])

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
