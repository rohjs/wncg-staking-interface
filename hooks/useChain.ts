import { useRouter } from 'next/router'

import { CHAINS, ChainId } from 'config/chains'
import { DEX } from 'config/constants/dex'
import { STAKING_ADDRESS } from 'config/constants/addresses'

export function useChain() {
  const { query } = useRouter()

  const chainId = (
    query.chainId ? Number(query.chainId) : ChainId.ETHEREUM
  ) as ChainId

  const chain = CHAINS[chainId]
  const dex = DEX[chainId]
  const stakingAddress = STAKING_ADDRESS[chainId]

  return {
    ...chain,
    ...dex,
    stakingAddress,
  }
}
