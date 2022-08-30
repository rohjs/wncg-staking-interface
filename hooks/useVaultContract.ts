import { useMemo } from 'react'
import { useRecoilValue } from 'recoil'
import { Contract } from 'ethers'

import { getAccount } from 'app/states/connection'
import { networkMismatchState } from 'app/states/network'
import { configService } from 'services/config'
import { BalancerVaultAbi } from 'lib/abi'
import { useProvider } from './useProvider'
import { useAppSelector } from './useRedux'

export function useVaultContract() {
  const provider = useProvider()

  const networkMismatch = useRecoilValue(networkMismatchState)
  const account = useAppSelector(getAccount)

  const vault = useMemo(() => {
    if (!provider || networkMismatch || !account) return null

    return new Contract(
      configService.vaultAddress,
      BalancerVaultAbi,
      provider.getSigner(account)
    )
  }, [account, networkMismatch, provider])

  return vault
}
