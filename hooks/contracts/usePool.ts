import { useQuery } from '@tanstack/react-query'

import { REFETCH_INTERVAL, STALE_TIME } from 'constants/time'
import { configService } from 'services/config'
import { fetchPoolDynamicData, fetchPoolStaticData } from 'lib/graphql'

export function usePool() {
  useQuery(['poolStaticData', configService.poolId], fetchPoolStaticData, {
    staleTime: Infinity,
    onSuccess() {},
  })

  useQuery(['poolDynamicData', configService.poolId], fetchPoolDynamicData, {
    staleTime: STALE_TIME,
    refetchInterval: REFETCH_INTERVAL,
  })
}
