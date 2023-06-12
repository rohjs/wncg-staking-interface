import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { QUERY_KEYS } from 'config/constants/queryKeys'
import { TOKENS } from 'config/constants/tokens'
import {
  LIQUIDITY_POOL_PLACEHOLDER,
  STAKING_PLACEHOLDER,
} from 'config/constants/placeholders'
import { useChain } from './useChain'
import { build } from 'lib/queries/build'
import { useSetAtom } from 'jotai'
import { priceMapAtom } from 'states/system'

type UseStakingReturnEthereum = LiquidityPool &
  EthereumStaking & {
    tokens: TokenMap
    priceMap: PriceMap
  }

type UseStakingReturnBsc = LiquidityPool &
  Staking & {
    tokens: TokenMap
    priceMap: PriceMap
  }

type UseStakingReturn<T extends 'ethereum' | undefined> = T extends undefined
  ? UseStakingReturnBsc
  : UseStakingReturnEthereum

export function useStaking<T extends 'ethereum' | undefined>() {
  const queryClient = useQueryClient()
  const { chainId } = useChain()

  const initialData = (queryClient.getQueryData([
    QUERY_KEYS.Build,
    chainId,
  ]) ?? {
    pool: LIQUIDITY_POOL_PLACEHOLDER,
    staking: STAKING_PLACEHOLDER[chainId],
    tokens: TOKENS[chainId],
    priceMap: {},
  }) satisfies {
    pool: LiquidityPool
    staking: Staking | EthereumStaking
    tokens: TokenMap
    priceMap: PriceMap
  }

  const setPriceMap = useSetAtom(priceMapAtom)

  const { data = initialData } = useQuery(
    [QUERY_KEYS.Build, chainId],
    () => build(chainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      initialData,
      onSuccess(data) {
        const { priceMap = {} } = data ?? {}
        setPriceMap(priceMap)
      },
    }
  )

  return {
    ...data?.pool,
    ...data?.staking,
    tokens: data?.tokens,
    priceMap: data?.priceMap,
  } as UseStakingReturn<T>
}
