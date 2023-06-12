import { memo } from 'react'
import { useInterval, useMount } from 'react-use'
import { useQueryClient } from '@tanstack/react-query'
import { useSetAtom } from 'jotai'

import { currentTimestampAtom, priceMapAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { now } from 'utils/now'
import { useFetchPrices } from 'hooks/queries'
import { useChain } from 'hooks'

function InterfaceHook() {
  const queryClient = useQueryClient()
  const { chainId } = useChain()

  const setCurrentTimestamp = useSetAtom(currentTimestampAtom)
  const setPriceMap = useSetAtom(priceMapAtom)

  useFetchPrices()

  useInterval(() => {
    setCurrentTimestamp(now())
  }, 10 * 1_000)

  useMount(() => {
    setCurrentTimestamp(now())
  })

  useMount(() => {
    const defaultPriceMap = queryClient.getQueryData([
      QUERY_KEYS.FallbackPrices,
      chainId,
    ]) as PriceMap

    setPriceMap(defaultPriceMap)
  })

  return null
}

export default memo(InterfaceHook)
