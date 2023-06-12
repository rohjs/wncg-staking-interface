import { useCallback } from 'react'
import { parseUnits } from 'ethers/lib/utils'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'

import { StakingEthereumAbi } from 'config/abi'
import { bnum } from 'utils/bnum'
import { useChain, useStaking, useSwitchNetwork } from 'hooks'

export function useStake(stakeAmount: string) {
  const { chainId, stakingAddress } = useChain()
  const { lpToken, tokens } = useStaking()
  const { switchBeforeSend } = useSwitchNetwork()

  const scaledStakeAmount = parseUnits(
    bnum(stakeAmount).toString(),
    tokens[lpToken.address]?.decimals ?? 18
  ).toString()

  const enabled = bnum(stakeAmount).gt(0) && !bnum(stakeAmount).isNaN()

  const { config: writeConfig } = usePrepareContractWrite({
    address: stakingAddress,
    abi: StakingEthereumAbi,
    chainId,
    args: [scaledStakeAmount],
    functionName: 'stake',
    enabled,
    onError: switchBeforeSend,
  })

  const { writeAsync } = useContractWrite(writeConfig)

  const stake = useCallback(async () => {
    try {
      const res = await writeAsync?.()
      return res?.hash
    } catch (error) {
      throw error
    }
  }, [writeAsync])

  return writeAsync ? stake : null
}
