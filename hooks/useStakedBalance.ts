import { useMemo } from 'react'
import { useAtomValue } from 'jotai'

import { legacyModeAtom } from 'states/userSettings'
import { configService } from 'services/config'
import { bnum } from 'utils/num'
import { useFiatCurrency } from './useFiatCurrency'
import { useStakedBalances } from './contracts'

const legacyContractIndex = configService.stakingContractAddresses.findIndex(
  (address) => address === configService.legacyStakingAddress
)
const stakingContractIndex = configService.stakingContractAddresses.indexOf(
  configService.stakingAddress
)

export function useStakedBalance() {
  const { bptToFiat } = useFiatCurrency()
  const { data: stakedBalances = [] } = useStakedBalances()

  const legacyMode = useAtomValue(legacyModeAtom)

  const currentVersionIndex = useMemo(
    () => (legacyMode ? legacyContractIndex : stakingContractIndex),
    [legacyMode]
  )

  const stakedBalance = useMemo(
    () => stakedBalances[currentVersionIndex],
    [currentVersionIndex, stakedBalances]
  )

  const stakedBalanceInFiatValue = useMemo(
    () => bptToFiat(stakedBalance),
    [bptToFiat, stakedBalance]
  )

  const hasStakedBalance = useMemo(
    () => bnum(stakedBalance).gt(0),
    [stakedBalance]
  )

  const hasBalanceInLegacyContract = useMemo(
    () => bnum(stakedBalances[legacyContractIndex]).gt(0),
    [stakedBalances]
  )

  return {
    hasBalanceInLegacyContract,
    hasStakedBalance,
    stakedBalance,
    stakedBalanceInFiatValue,
  }
}
