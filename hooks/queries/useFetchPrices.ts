import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { priceMapAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { MINUTE_MS } from 'config/constants/time'
import { fetchPrices } from 'lib/queries/fetchPrices'
import { calcLpTokenPrice } from 'utils/calcLpTokenPrice'
import { useChain, useStaking } from 'hooks'
import { useFetchPool } from './useFetchPool'

export function useFetchPrices(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval = 10 * MINUTE_MS,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const queryClient = useQueryClient()
  const { chainId } = useChain()
  const {
    lpToken: initLpToken,
    rewardTokenAddresses,
    poolTokenAddresses,
  } = useStaking()

  const { lpToken = initLpToken, poolTokens = [] } = useFetchPool().data ?? {}

  const setPriceMap = useSetAtom(priceMapAtom)

  const initialData = queryClient.getQueryData<PriceMap>(
    [QUERY_KEYS.FallbackPrices, chainId],
    {
      exact: false,
    }
  )

  return useQuery<PriceMap>(
    [QUERY_KEYS.Staking.Prices, chainId],
    () =>
      fetchPrices(chainId, [...poolTokenAddresses, ...rewardTokenAddresses]),
    {
      enabled,
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      useErrorBoundary: false,
      initialData,
      suspense,
      onSuccess(data) {
        const lpTokenPrice = calcLpTokenPrice(
          chainId,
          poolTokens,
          lpToken.address,
          lpToken.totalSupply,
          data
        )

        setPriceMap((prev) => ({
          ...prev,
          ...data,
          ...lpTokenPrice,
        }))
      },
      onError() {
        setPriceMap((prev) => ({ ...prev, ...initialData }))
      },
    }
  )
}
