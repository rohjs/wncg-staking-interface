import { useMemo } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { STALE_TIME } from 'constants/time'
import { TOKEN_PRICES_PLACEHOLDERS } from 'constants/tokens'
import { fetchTokenPrices } from 'lib/coingecko'
import {
  fetchCoinmarketCapTokenPrice,
  parseCoinmarketCapPrice,
} from 'lib/coinmarketCap'
import { uniqAddress } from 'utils/address'
import { usePool } from '../usePool'
import { useStaking } from '../useStaking'

export function usePrices() {
  const queryClient = useQueryClient()

  const { poolTokenAddresses } = usePool()
  const { rewardTokensList } = useStaking()

  const addresses = useMemo(
    () => uniqAddress([...poolTokenAddresses, ...rewardTokensList]),
    [poolTokenAddresses, rewardTokensList]
  )

  useQuery(['fallbackTokenPrices'], fetchCoinmarketCapTokenPrice, {
    retry: false,
    staleTime: Infinity,
    select(response) {
      return parseCoinmarketCapPrice(response.data)
    },
  })

  useQuery(['tokenPrices', addresses], () => fetchTokenPrices(addresses), {
    staleTime: STALE_TIME,
    onError() {
      const initialTokenPrices =
        queryClient.getQueryData<TokenPrices>(['fallbackTokenPrices']) ||
        TOKEN_PRICES_PLACEHOLDERS
      queryClient.setQueryData(['tokenPrices', addresses], initialTokenPrices)
    },
  })
}
