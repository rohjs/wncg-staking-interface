import { useCallback } from 'react'
import { useAtomValue } from 'jotai'

import { priceMapAtom } from 'states/system'
import { bnum } from 'utils/bnum'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from 'config/constants/queryKeys'

export function useFiat() {
  const queryClient = useQueryClient()
  const priceMap =
    useAtomValue(priceMapAtom) ??
    queryClient.getQueryData([QUERY_KEYS.Prices], { exact: false })

  const toFiat = useCallback(
    (amount: string | number, tokenAddress: string) => {
      if (!tokenAddress) return '0'

      const price = priceMap[tokenAddress?.toLowerCase() as Hash] ?? '0'
      return bnum(amount).times(price).toFixed(18, 3)
    },
    [priceMap]
  )

  return toFiat
}
