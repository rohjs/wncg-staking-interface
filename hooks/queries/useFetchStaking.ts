import { useQuery } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { currentTimestampAtom, isHarvestableAtom } from 'states/system'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { fetchStaking } from 'lib/queries/fetchStaking'
import { useChain } from 'hooks/useChain'
import { useStaking } from 'hooks/useStaking'

export function useFetchStaking(options: UseFetchOptions = {}) {
  const {
    enabled: _enabled = true,
    refetchInterval,
    refetchOnWindowFocus,
    suspense = true,
  } = options

  const { chainId, stakingAddress } = useChain()
  const { balancerGaugeAddress } = useStaking<'ethereum'>()

  const currentTimestamp = useAtomValue(currentTimestampAtom)
  const setIsHarvestable = useSetAtom(isHarvestableAtom)

  const enabled = _enabled && !!balancerGaugeAddress

  return useQuery(
    [QUERY_KEYS.Staking.Data, stakingAddress, chainId],
    () => fetchStaking(chainId),
    {
      enabled,
      staleTime: Infinity,
      refetchInterval,
      refetchOnWindowFocus,
      suspense,
      useErrorBoundary: false,
      onSuccess(data) {
        // if (!data) return
        // if (data.periodFinish > currentTimestamp) setIsHarvestable(false)
        // else setIsHarvestable(true)
      },
    }
  )
}
