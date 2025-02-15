import { useCallback } from 'react'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { constants } from 'ethers'

import config from 'config'
import { Erc20Abi } from 'config/abi'
import { useSwitchNetwork } from 'hooks'

const approveConfig = Object.freeze({
  abi: Erc20Abi,
  chainId: config.chainId,
  functionName: 'approve',
})

export function useApprove(tokenAddress: Hash, spender: string) {
  const { switchBeforeSend } = useSwitchNetwork()

  const { config } = usePrepareContractWrite({
    ...approveConfig,
    address: tokenAddress as Hash,
    args: [spender, constants.MaxUint256],
    enabled: !!tokenAddress && !!spender,
    onError: switchBeforeSend,
  })

  const { writeAsync } = useContractWrite(config)

  const approve = useCallback(async () => {
    try {
      const response = await writeAsync?.()
      return response?.hash
    } catch (error: any) {
      throw error
    }
  }, [writeAsync])

  return approve
}
