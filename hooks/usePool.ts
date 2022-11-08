import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { configService } from 'services/config'
import {} from 'lib/graphql'
import { bnum } from 'utils/num'
import { getTokenColor, getTokenInfo, getTokenSymbol } from 'utils/token'

export function usePool() {
  const queryClient = useQueryClient()
  const poolStaticData = queryClient.getQueryData<PoolStaticData>([
    'poolStaticData',
    configService.poolId,
  ])
  const poolDynamicData = queryClient.getQueryData<PoolDynamicData>([
    'poolDynamicData',
    configService.poolId,
  ])

  const poolId = configService.poolId

  const poolSwapFee = useMemo(
    () => poolDynamicData?.swapFee || '0',
    [poolDynamicData?.swapFee]
  )

  const poolTokens: PoolToken[] = useMemo(() => {
    return (
      poolStaticData?.tokens.map((token, i) => ({
        ...token,
        balance: poolDynamicData?.tokens[i]?.balance ?? '0',
      })) ?? []
    )
  }, [poolDynamicData?.tokens, poolStaticData?.tokens])

  const poolTokenAddresses = useMemo(
    () =>
      poolStaticData?.tokensList.map((address) => address.toLowerCase()) || [],
    [poolStaticData?.tokensList]
  )

  const poolTokenBalances = useMemo(
    () => poolDynamicData?.tokens.map((token) => token.balance) ?? [],
    [poolDynamicData?.tokens]
  )

  const poolTokenColors = useMemo(
    () => poolTokenAddresses.map((address) => getTokenColor(address)),
    [poolTokenAddresses]
  )

  const poolTokenDecimals = useMemo(
    () => poolTokens.map((token) => token.decimals),
    [poolTokens]
  )

  const poolTokenWeights = useMemo(
    () => poolTokens.map((token) => token.weight),
    [poolTokens]
  )

  const poolTokenWeightsInPcnt = useMemo(
    () => poolTokenWeights.map((weight) => bnum(weight).times(100).toNumber()),
    [poolTokenWeights]
  )

  const poolTokenSymbols = useMemo(
    () => poolTokenAddresses.map((address) => getTokenInfo(address).symbol),
    [poolTokenAddresses]
  )

  const poolTotalShares = useMemo(
    () => poolDynamicData?.totalShares || '0',
    [poolDynamicData?.totalShares]
  )

  const poolTotalLiquidity = useMemo(
    () => poolDynamicData?.totalLiquidity || '0',
    [poolDynamicData?.totalLiquidity]
  )

  const poolTotalSwapFee = useMemo(
    () => poolDynamicData?.totalSwapFee || '0',
    [poolDynamicData?.totalSwapFee]
  )

  const poolTotalSwapVolume = useMemo(
    () => poolDynamicData?.totalSwapVolume || '0',
    [poolDynamicData?.totalSwapVolume]
  )

  const poolName = useMemo(() => poolTokenSymbols.join('-'), [poolTokenSymbols])

  const nativeAssetIndex = useMemo(() => {
    const match = poolTokenAddresses.findIndex(
      (address) => address.toLowerCase() === configService.weth
    )
    return Math.max(match, 0)
  }, [poolTokenAddresses])

  const ercTokenIndex = useMemo(() => {
    const match = poolTokenAddresses.findIndex(
      (address) => address.toLowerCase() !== configService.weth
    )
    return Math.max(match, 0)
  }, [poolTokenAddresses])

  const bptAddress = useMemo(
    () => poolStaticData?.address,
    [poolStaticData?.address]
  )

  const poolTokenName = useMemo(() => getTokenSymbol(bptAddress), [bptAddress])

  return {
    poolId,
    poolName,
    poolSwapFee,
    poolStaticData,
    poolTokens,
    poolTokenAddresses,
    poolTokenBalances,
    poolTokenColors,
    poolTokenDecimals,
    poolTokenName,
    poolTokenSymbols,
    poolTotalShares,
    poolTokenWeights,
    poolTokenWeightsInPcnt,
    poolTotalLiquidity,
    poolTotalSwapFee,
    poolTotalSwapVolume,
    ercTokenIndex,
    nativeAssetIndex,
    bptAddress,
  }
}
