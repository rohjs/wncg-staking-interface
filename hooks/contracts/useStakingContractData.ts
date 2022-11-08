import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractReads } from 'wagmi'
import type { UseQueryResult } from 'wagmi/dist/declarations/src/hooks/utils'

import { stakingContractAddressAtom } from 'states/staking'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'

const log = createLogger(`orange`)

const FNS = [
  'earmarkIncentive',
  'FEE_DENOMINATOR',
  'balancerGauge',
  'REWARD_TOKEN',
  'STAKED_TOKEN',
  'getBALRewardRate',
  'getWNCGEmissionPerSec',
  'COOLDOWN_SECONDS',
  'UNSTAKE_WINDOW',
]
const ABIS = findAbiFromStaking(...FNS)

export function useStakingContractData() {
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
      })),
    [stakingAddress]
  )

  const result = useContractReads({
    contracts,
    staleTime: Infinity,
    enabled: !!stakingAddress,
    select(data: unknown = []) {
      const [
        earmarkIncentiveFee,
        feeDenominator,
        balancerGauge,
        rewardToken,
        stakedToken,
        balEmissionPerSec,
        wncgEmissionPerSec,
        cooldownSeconds,
        unstakeWindow,
      ] = data as [
        BigNumber,
        BigNumber,
        string,
        string,
        string,
        BigNumber,
        BigNumber,
        BigNumber,
        BigNumber
      ]

      return [
        earmarkIncentiveFee?.toNumber() ?? 0,
        feeDenominator?.toNumber() ?? 0,
        balancerGauge ?? '',
        rewardToken?.toLowerCase() ?? '',
        stakedToken?.toLowerCase() ?? '',
        formatUnits(balEmissionPerSec?.toString() ?? 0),
        formatUnits(wncgEmissionPerSec?.toString() ?? 0),
        cooldownSeconds?.toNumber() ?? 0,
        unstakeWindow?.toNumber() ?? 0,
      ]
    },
    onSuccess() {
      log(`staking`)
    },
    onError(error) {
      log(`staking`, error)
    },
  }) as UseQueryResult<Array<string | number>, any>

  return result
}
