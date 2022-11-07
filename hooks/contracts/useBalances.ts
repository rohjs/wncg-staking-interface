import { useMemo } from 'react'
import { useSetAtom } from 'jotai'
import type { BigNumber } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import { useBalance, useContractReads } from 'wagmi'

import { etherBalanceAtom, tokenBalancesAtom } from 'states/user'
import { configService } from 'services/config'
import { uniqAddress } from 'utils/address'
import { associateBalances } from 'utils/contract'
import { createLogger } from 'utils/log'
import { networkChainId } from 'utils/network'
import { findAbiFromErc20 } from 'utils/wagmi'
import { useAccount } from '../useAccount'
import { usePool } from '../usePool'
import { useStaking } from '../useStaking'

const FN = 'balanceOf'
const ABI = findAbiFromErc20(FN)

const log = createLogger(`green`)

export function useBalances() {
  const { account } = useAccount()
  const { poolTokenAddresses } = usePool()
  const { rewardTokenAddress, stakedTokenAddress } = useStaking()

  const setEtherBalance = useSetAtom(etherBalanceAtom)
  const setTokenBalances = useSetAtom(tokenBalancesAtom)

  const addresses = useMemo(
    () =>
      uniqAddress([
        ...poolTokenAddresses,
        rewardTokenAddress,
        configService.bal,
        stakedTokenAddress,
      ]),
    [poolTokenAddresses, rewardTokenAddress, stakedTokenAddress]
  )

  const contracts = useMemo(
    () =>
      addresses.map((address) => ({
        address: address,
        abi: ABI,
        functionName: FN,
        chainId: networkChainId,
        args: [account],
      })),
    [account, addresses]
  )

  useBalance({
    addressOrName: account,
    enabled: !!account,
    watch: true,
    suspense: true,
    onSuccess(data: unknown) {
      log(`ETH balances`)
      setEtherBalance((data as FetchBalanceResult)?.formatted || '0')
    },
    onError(error) {
      log(`ETH balances`, error)
    },
  })

  return useContractReads({
    contracts,
    enabled: !!account,
    watch: true,
    suspense: true,
    select(data: unknown = []) {
      return (data as FetchBalanceResult[]).map((result) => {
        return formatUnits(result.value?.toString() || '0', result.decimals)
      })
    },
    onSuccess(data: unknown = []) {
      log(`balances`)
      const balanceMap = associateBalances(data as BigNumber[], addresses)
      setTokenBalances(balanceMap)
    },
  })
}
