import { useMemo } from 'react'
import { parseUnits } from 'ethers/lib/utils'

import { configService } from 'services/config'
import { useRewards as useFetchRewards } from './contracts/useRewards'
import { useFiatCurrency } from './useFiatCurrency'
import { usePrices } from './usePrices'
import { useStaking } from './useStaking'

export function useRewards() {
  const { data: rewards = [] } = useFetchRewards()
  const { toFiat } = useFiatCurrency()
  const { priceFor } = usePrices()
  const {
    rewardTokenAddress,
    rewardTokensList,
    rewardTokenDecimals,
    rewardTokenSymbols,
  } = useStaking()

  const scaledRewards = useMemo(
    () =>
      rewards.map((reward, i) => parseUnits(reward, rewardTokenDecimals[i])),
    [rewardTokenDecimals, rewards]
  )

  const rewardsInFiatValue = useMemo(
    () => rewards.map((reward, i) => toFiat(rewardTokensList[i], reward)),
    [rewardTokensList, rewards, toFiat]
  )

  const rewardTokenPrices = useMemo(
    () => rewardTokensList.map((address) => priceFor(address)),
    [priceFor, rewardTokensList]
  )

  const rewardTokenIndex = useMemo(
    () => rewardTokensList.indexOf(rewardTokenAddress),
    [rewardTokenAddress, rewardTokensList]
  )

  const balTokenIndex = useMemo(
    () => rewardTokensList.indexOf(configService.bal),
    [rewardTokensList]
  )

  return {
    balTokenIndex,
    rewards,
    rewardsInFiatValue,
    rewardTokenAddress,
    rewardTokenIndex,
    rewardTokensList,
    rewardTokenPrices,
    rewardTokenSymbols,
    scaledRewards,
  }
}
