import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { BalancerVaultAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { useAuth, useBalancerSdk, useChain, useSwitchNetwork } from 'hooks'
import { useExitBuildRequest } from './useExitBuildRequest'
import { useCallback, useState } from 'react'

type UseExitPoolParams = {
  assets: Hash[]
  bptOutPcnt: string
  exitAmounts: string[]
  exitType: Hash | null
  isExactOut: boolean
}

export function useExitPool({
  assets,
  bptOutPcnt,
  exitType,
  exitAmounts,
  isExactOut,
}: UseExitPoolParams) {
  const { account } = useAuth()
  const { chainId, dexProtocolAddress, dexPoolId, networkMismatch } = useChain()
  const { switchBeforeSend } = useSwitchNetwork()

  const request = useExitBuildRequest({
    account,
    assets,
    amounts: exitAmounts,
    exitType,
    isExactOut,
    bptOutPcnt,
  })

  console.log(3, [dexPoolId, account, account, request?.userData])

  const enabled =
    !networkMismatch && exitAmounts.some((amt) => bnum(amt).gt(0)) && !!request

  const { config: writeConfig } = usePrepareContractWrite({
    address: dexProtocolAddress,
    abi: BalancerVaultAbi,
    chainId,
    args: [dexPoolId, account, account, request],
    functionName: 'exitPool',
    enabled,
    onError: switchBeforeSend,
  })

  const { writeAsync } = useContractWrite(writeConfig)

  async function exitPool() {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }

  return writeAsync ? exitPool : undefined
}
