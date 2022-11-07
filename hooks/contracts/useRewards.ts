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
import { useAccount } from '../useAccount'
import { useStaking } from '../useStaking'

const FNS = ['earnedWNCG', 'earnedBAL']
const ABIS = findAbiFromStaking(...FNS)

const log = createLogger(`green`)

export function useRewards() {
  const { account } = useAccount()
  const { rewardTokenDecimals } = useStaking()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
        args: [account],
      })),
    [account, stakingAddress]
  )

  return useContractReads({
    contracts,
    enabled: !!account,
    watch: true,
    suspense: true,
    select(data: unknown = []) {
      return (data as BigNumber[]).map((amount, i) =>
        formatUnits(amount?.toString() || '0', rewardTokenDecimals[i] || 18)
      )
    },
    onSettled() {
      log(`rewards`)
    },
    onError(error) {
      log(`rewards`, error)
    },
  }) as UseQueryResult<string[], any>
}
