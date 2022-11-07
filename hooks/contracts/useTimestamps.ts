import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import type { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import { isPast } from 'date-fns'
import type { UseQueryResult } from 'wagmi/dist/declarations/src/hooks/utils'

import { stakingContractAddressAtom } from 'states/staking'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromStaking } from 'utils/wagmi'
import { useAccount } from '../useAccount'
import { useStakedBalance } from '../useStakedBalance'

const log = createLogger(`green`)

const FNS = ['getCooldownEndTimestamp', 'getWithdrawEndTimestamp']
const ABIS = findAbiFromStaking(...FNS)

export function useTimestamps() {
  const { account } = useAccount()
  const { hasStakedBalance } = useStakedBalance()

  const stakingAddress = useAtomValue(stakingContractAddressAtom)

  const contracts = useMemo(
    () =>
      FNS.map((fn) => ({
        address: stakingAddress,
        abi: ABIS,
        functionName: fn,
        chainId: networkChainId,
        args: [account!],
      })),
    [account, stakingAddress]
  )

  return useContractReads({
    contracts,
    enabled: !!account && hasStakedBalance,
    watch: true,
    select(data: unknown = []) {
      log(`timestamps`)

      let timestamps = (data as BigNumber[]).map(
        (timestamp) => timestamp?.toNumber() * 1_000 || 0
      )
      const [, withdrawEndsAt] = timestamps

      if (isPast(withdrawEndsAt)) {
        timestamps = [0, 0]
      }

      return timestamps
    },
    onSettled() {
      log(`timestamps`)
    },
    onError(error) {
      log(`timestamps`, error)
    },
  }) as UseQueryResult<number[], any>
}
