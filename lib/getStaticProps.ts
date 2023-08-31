import { dehydrate, QueryClient } from '@tanstack/react-query'
import type { GetStaticPropsContext } from 'next'

import config from 'config'
import { ChainId, defaultChainId, SUPPORTED_CHAINS } from 'config/chains'
import { QUERY_KEYS } from 'config/constants/queryKeys'
import { getQueryString } from 'utils/getQueryString'
import { fetchPoolSnapshot } from 'lib/queries/fetchPoolSnapshot'
import { fetchStaking } from './queries/fetchStaking'
import { fetchPrices } from './queries/fetchPrices'

export async function getStaticProps(ctx: GetStaticPropsContext) {
  const queryClient = new QueryClient()

  const _chainId = getQueryString(ctx?.params?.chainId)
  const chainId = Math.max(Number(_chainId), defaultChainId) as ChainId

  if (!SUPPORTED_CHAINS.includes(chainId)) throw Error()

  const project = await fetchStaking(chainId)
  const prices = await fetchPrices(chainId)

  const ethereumChainId = config.isTestnet ? ChainId.GOERLI : ChainId.ETHEREUM
  const bscChainId = config.isTestnet ? ChainId.BSC_TESTNET : ChainId.BSC
  await queryClient.prefetchQuery(
    [QUERY_KEYS.Build, ethereumChainId],
    () => fetchStaking(ethereumChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Build, bscChainId],
    () => fetchStaking(bscChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Staking.Prices, ethereumChainId],
    () => fetchPrices(ethereumChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery(
    [QUERY_KEYS.Staking.Prices, bscChainId],
    () => fetchPrices(bscChainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  await queryClient.prefetchQuery<PoolSnapshotResponse>(
    [QUERY_KEYS.Pool.Snapshot, chainId],
    () => fetchPoolSnapshot(chainId),
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      chainId,
      project,
      prices,
    },
    revalidate: 60 * 10,
  }
}
