import { useMemo } from 'react'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useContractReads } from 'wagmi'
import type { UseQueryResult } from 'wagmi/dist/declarations/src/hooks/utils'

import { configService } from 'services/config'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useAccount } from '../useAccount'

const FN = 'stakedTokenBalance'
const ABI = findAbiFromStaking(FN)

const log = createLogger(`green`)

export function useStakedBalances() {
  const { account } = useAccount()

  const contracts = useMemo(
    () =>
      configService.stakingContractAddresses.map((address) => ({
        address: address,
        abi: ABI,
        functionName: FN,
        chainId: networkChainId,
        args: [account],
      })),
    [account]
  )

  return useContractReads({
    contracts,
    cacheTime: Infinity,
    enabled: !!account,
    watch: true,
    suspense: true,
    select(data: unknown = []) {
      return (data as BigNumber[]).map((amount) =>
        formatUnits(amount?.toString() ?? '0')
      )
    },
    onSettled() {
      log(`staked balances`)
    },
    onError(error) {
      log(`staked balances`, error)
    },
  }) as UseQueryResult<string[], any>
}
