import type { Contract } from 'ethers'
import { parseEther } from 'ethers/lib/utils'
import type { TransactionResponse } from '@ethersproject/providers'

import { sanitizeNumber } from 'utils/num'

export async function unstakeBpt(
  contract: Contract,
  amount: string,
  isClaimAllRewards?: boolean
): Promise<TransactionResponse> {
  return await contract.withdraw(
    parseEther(sanitizeNumber(amount)),
    isClaimAllRewards
  )
}
