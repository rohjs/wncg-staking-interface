import { useMemo } from 'react'

import { associate } from 'utils/contract'
import { useStakingContractData } from './contracts'

// const STAKING_DATA_PLACEHOLDER: StakingContractData = Object.freeze({
//   earmarkIncentivePcnt: 0,
//   emissions: [],
//   liquidityGaugeAddress: '',
//   rewardTokenAddress: '',
//   rewardTokensList: [],
//   rewardTokenDecimals: [],
//   rewardTokenSymbols: [],
//   stakedTokenAddress: '',
//   cooldownWindowPeriod: 0,
//   withdrawWindowPeriod: 0,
// })

export function useStaking() {
  const { data } = useStakingContractData()
  const stakingData = useMemo(() => associate(data ?? []), [data])

  return stakingData
}
