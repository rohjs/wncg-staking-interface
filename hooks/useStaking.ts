import { useMemo } from 'react'
import type { StakingContractData } from 'states/staking'
import { associate } from 'utils/contract'
import { useStakingContractData } from './contracts'

const STAKING_DATA_PLACEHOLDER: StakingContractData = Object.freeze({
  earmarkIncentivePcnt: 0,
  emissions: [],
  liquidityGaugeAddress: '',
  rewardTokenAddress: '',
  rewardTokensList: [],
  rewardTokenDecimals: [],
  rewardTokenSymbols: [],
  stakedTokenAddress: '',
  cooldownWindowPeriod: 0,
  withdrawWindowPeriod: 0,
  status: `idle`,
})

export function useStaking() {
  const { data, status } = useStakingContractData()
  const stakingData = useMemo(() => associate(data ?? []), [data])

  return { ...stakingData, status } ?? STAKING_DATA_PLACEHOLDER
}
