import { useMemo } from 'react'
import { useAtomValue } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'
import type { BigNumber } from 'ethers'
import { useContractReads } from 'wagmi'
import { isPast } from 'date-fns'

import { stakingContractAddressAtom } from 'states/staking'
import { timestampsAtom } from 'states/user'
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
  const setTimestamps = useUpdateAtom(timestampsAtom)

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

  useContractReads({
    contracts,
    enabled: !!account && hasStakedBalance,
    watch: true,
    onSuccess(data: unknown = []) {
      log(`timestamps`)

      let timestamps = (data as BigNumber[]).map(
        (timestamp) => timestamp?.toNumber() * 1_000 || 0
      )
      const [, withdrawEndsAt] = timestamps

      if (isPast(withdrawEndsAt)) {
        timestamps = [0, 0]
      }

      setTimestamps(timestamps)
    },
    onError(error) {
      log(`timestamps`, error)
    },
  })
}
