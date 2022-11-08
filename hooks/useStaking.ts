import { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import type { StakingContractData } from 'states/staking'
import { associate } from 'utils/contract'

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
  const queryClient = useQueryClient()
  const data = queryClient.getQueryData<Array<string | number>>([`staking`])
  const stakingData = useMemo(() => associate(data ?? []), [data])

  return { ...stakingData } ?? STAKING_DATA_PLACEHOLDER
}
