import { useAtomValue } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractRead } from 'wagmi'
import type { UseQueryResult } from 'wagmi/dist/declarations/src/hooks/utils'

import { stakingContractAddressAtom } from 'states/staking'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'

const FN = 'totalStaked'
const ABI = findAbiFromStaking(FN)

const log = createLogger(`orange`)

export function useTotalStaked() {
  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  return useContractRead({
    address: stakingAddress!,
    abi: ABI,
    functionName: FN,
    chainId: networkChainId,
    watch: true,
    suspense: true,
    select(data: unknown) {
      return formatUnits((data as BigNumber)?.toString() ?? 0)
    },
    onSettled() {
      log(`total staked`)
    },
    onError(error) {
      log(`total staked`, error)
    },
  }) as UseQueryResult<string, any>
}
