import { useMemo } from 'react'
import { BigNumber } from 'ethers'
import { useBalance, useContractReads } from 'wagmi'
import type { UseQueryResult } from 'wagmi/dist/declarations/src/hooks/utils'

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

  const { data: ethBalance } = useBalance({
    addressOrName: account,
    enabled: !!account,
    watch: true,
    suspense: true,
    onSuccess() {
      log(`ETH balances`)
    },
    onError(error) {
      log(`ETH balances`, error)
    },
  })

  const { data: tokenBalances } = useContractReads({
    contracts,
    enabled: !!account,
    watch: true,
    suspense: true,
    onSuccess() {
      log(`balances`)
    },
  }) as UseQueryResult<BigNumber[], any>

  const balances = [
    ...(tokenBalances ?? []),
    ethBalance?.value ?? BigNumber.from(0),
  ]
  const tokenAddresses = [...addresses, configService.nativeAssetAddress]

  return associateBalances(balances, tokenAddresses)
}
