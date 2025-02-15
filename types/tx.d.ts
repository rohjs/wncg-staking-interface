type TxStatus = 'pending' | 'fulfilled' | 'error' | 'canceled'

type Tx = {
  addedTime: number
  data: string
  hash: string
  status: TxStatus
  toast: ToastContent
  transaction: Transaction
  error?: any
  finalizedTime?: number
}

type TxMap = {
  [id: string]: Tx
}

type TxError = {
  title: string
  message: string
}

type ApproveNextAction = {
  type: ModalType
  props?: any
}

type ApproveTx = {
  spender?: Hash
  spenderName?: string
  hash?: Hash
  desc?: string
  buttonLabel?: string
  toastLabel?: string
  titleSuffix?: string
  tokenAddress?: Hash
  tokenName?: string
  tokenSymbol?: string
  tokenDecimals?: number
  completeMessage?: string
  nextAction?: ApproveNextAction
}

type ClaimTx = {
  hash?: Hash
  earnedRewards?: string[]
  rewardList?: boolean[]
  totalClaimFiatValue?: string
}

type CooldownTx = {
  hash?: Hash
}

type StakeTx = {
  hash?: Hash
  stakeAmount?: string
  stakedTokenBalance?: string
}

type UnstakeTx = {
  hash?: Hash
  earnedRewards?: string[]
  unstakeAmount?: string
  stakedTokenBalance?: string
  totalClaimFiatValue?: string
}

type JoinTx = {
  hash?: Hash
  assets?: Hash[]
  joinAmounts?: string[]
  bptBalance?: string
  totalJoinFiatValue?: string
}

type ExitTx = {
  assets?: Hash[]
  hash?: Hash
  exitAmounts?: string[]
  totalExitFiatValue?: string
  isProportional?: boolean
  exactOut?: boolean
  exitType?: Hash | null
  bptOutPcnt?: string
  bptIn?: string
  tokenOutIndex?: number
}

type HarvestTx = {
  hash?: Hash
}
