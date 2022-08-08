import { useCallback, useEffect } from 'react'
import { Event } from 'ethers'

import { removeTx, TransactionAction } from 'app/states/transaction'

import {
  useAppDispatch,
  useBpt,
  useConfirmations,
  useEventFilter,
  useProvider,
  useReward,
  useStake,
  useToast,
  useTransaction,
  useUnstake,
} from 'hooks'

export function UnstakeEffects() {
  const { balanceOf, totalSupply } = useBpt()
  const { getConfirmations, setConfirmations } = useConfirmations()
  const { cooldownEventFilter, withdrawnEventFilter } = useEventFilter()
  const provider = useProvider()
  const { earnedBal, earnedWncg } = useReward()
  const { stakedTokenBalance, totalStaked } = useStake()
  const { addToast } = useToast()
  const { getTransactionReceipt } = useTransaction()
  const { getTimestamps, unstakeWindow } = useUnstake()

  const dispatch = useAppDispatch()

  useEffect(() => {
    getTimestamps()
  }, [getTimestamps])

  useEffect(() => {
    unstakeWindow()
  }, [unstakeWindow])

  const handleCooldownEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.StartCooldown,
          hash: transactionHash,
          summary: 'Successfully started cooldown',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)

      getTimestamps()
    },
    [
      addToast,
      dispatch,
      getConfirmations,
      getTimestamps,
      getTransactionReceipt,
      setConfirmations,
    ]
  )

  const handleWithdrawnEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(transactionHash)
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.Withdraw,
          hash: transactionHash,
          summary: 'Successfully withdrew staked 20WETH-80WNCG',
          showPartyEmoji: true,
        })
      }
      setConfirmations(transactionHash)

      stakedTokenBalance()
      balanceOf()
      totalSupply()
      totalStaked()
    },
    [
      addToast,
      balanceOf,
      dispatch,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
      stakedTokenBalance,
      totalStaked,
      totalSupply,
    ]
  )

  const handleWithdrawnAndAllRewardsEvent = useCallback(
    async ({ transactionHash }: Event) => {
      const receipt = await getTransactionReceipt(transactionHash)
      if (!receipt) return

      dispatch(removeTx(transactionHash))

      const confirmations = getConfirmations(
        `${transactionHash}_withdrawAndClaim`
      )
      if (!confirmations) return
      if (confirmations !== 'fulfilled') {
        addToast({
          action: TransactionAction.Withdraw,
          hash: transactionHash,
          summary: 'Successfully withdrew and claimed',
          showPartyEmoji: true,
        })
      }
      setConfirmations(`${transactionHash}_withdrawAndClaim`)

      balanceOf()
      earnedBal()
      earnedWncg()
      stakedTokenBalance()
      totalSupply()
      totalStaked()
    },
    [
      addToast,
      balanceOf,
      dispatch,
      earnedBal,
      earnedWncg,
      getConfirmations,
      getTransactionReceipt,
      setConfirmations,
      stakedTokenBalance,
      totalStaked,
      totalSupply,
    ]
  )

  // NOTE: Cooldown event
  useEffect(() => {
    if (cooldownEventFilter) {
      provider?.on(cooldownEventFilter, handleCooldownEvent)
      return () => {
        provider?.off(cooldownEventFilter)
      }
    }
  }, [cooldownEventFilter, handleCooldownEvent, provider])

  // NOTE: Withdrawn event
  useEffect(() => {
    if (withdrawnEventFilter) {
      provider?.on(withdrawnEventFilter, handleWithdrawnEvent)
      provider?.on(withdrawnEventFilter, handleWithdrawnAndAllRewardsEvent)
      return () => {
        provider?.off(withdrawnEventFilter)
      }
    }
  }, [
    handleWithdrawnAndAllRewardsEvent,
    handleWithdrawnEvent,
    provider,
    withdrawnEventFilter,
  ])

  return null
}