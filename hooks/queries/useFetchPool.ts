import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { priceMapAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchPool } from 'lib/queries/fetchPool'
import { calcLpTokenPrice } from 'utils/calcLpTokenPrice'
import { useChain } from 'hooks/useChain'

export function useFetchPool(options: UseFetchOptions = {}) {
  const {
    enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId } = useChain()

  const [priceMap, setPriceMap] = useAtom(priceMapAtom)

  return useQuery([QUERY_KEYS.Pool.Data, chainId], () => fetchPool(chainId), {
    enabled,
    staleTime: Infinity,
    refetchInterval,
    refetchOnWindowFocus,
    suspense,
    useErrorBoundary: false,
    onSuccess(data) {
      const { poolTokens, lpToken } = data

      const lpTokenPrice = calcLpTokenPrice(
        chainId,
        poolTokens,
        lpToken.address,
        lpToken.totalSupply,
        priceMap
      )

      setPriceMap((prev) => ({
        ...prev,
        ...lpTokenPrice,
      }))
    },
  })
}
