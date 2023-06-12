import { useAtomValue } from 'jotai'
import { priceMapAtom } from 'states/system'

import { calcApr } from 'utils/calcApr'
import { useFiat } from './useFiat'
import { useStaking } from './useStaking'
import { useFetchStaking } from './queries'

export function useApr() {
  const toFiat = useFiat()
  const priceMap = useAtomValue(priceMapAtom)
  const {
    lpToken,
    rewardEmissionsPerSec,
    rewardTokenAddresses,
    totalStaked: _initTotalStaked,
  } = useStaking()

  const { totalStaked = _initTotalStaked } = useFetchStaking().data ?? {}

  const totalStakedValue = toFiat(totalStaked, lpToken.address)

  const aprs = rewardEmissionsPerSec.map((e, i) =>
    calcApr(e, toFiat(1, rewardTokenAddresses[i]) ?? '0', totalStakedValue)
  )

  return aprs
}
