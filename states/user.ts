import { atom } from 'jotai'
import { atomWithObservable } from 'jotai/utils'
import { interval, map } from 'rxjs'
import { roundToNearestMinutes } from 'date-fns'

import { UnstakePhase } from 'constants/types'
import { configService } from 'services/config'

export type AllowanceMap = {
  [address: string]: boolean
}

export type AllowancesMap = {
  [spender: string]: AllowanceMap
}

export type BalanceMap = {
  [address: string]: string
}

export const allowancesAtom = atom<AllowancesMap>({})
export const etherBalanceAtom = atom<string>('')
export const tokenBalancesAtom = atom<BalanceMap>({})
export const rewardsAtom = atom(['0', '0'])
export const stakedTokenBalancesAtom = atom<string[]>([])
export const timestampsAtom = atom([0, 0])

// NOTE: Read-only Derived Atoms
export const balancesAtom = atom((get) => {
  const etherBalance = get(etherBalanceAtom)
  const tokenBalanceMap = get(tokenBalancesAtom)
  return {
    ...tokenBalanceMap,
    [configService.nativeAssetAddress]: etherBalance,
  }
})

export const roundedTimestampsAtom = atom((get) => {
  const [cooldownEndsAt, withdrawEndsAt] = get(timestampsAtom)
  return [
    roundToNearestMinutes(cooldownEndsAt, { roundingMethod: 'ceil' }),
    roundToNearestMinutes(withdrawEndsAt, { roundingMethod: 'floor' }),
  ]
})

// NOTE: Timestamp
const nowSubject = interval(1_000).pipe(map(() => Date.now()))
export const nowAtom = atomWithObservable(() => nowSubject, {
  initialValue: 0,
})

export const unstakePhaseAtom = atom(async (get) => {
  const timestamps = get(timestampsAtom)

  if (timestamps.every((t) => t === 0)) {
    return UnstakePhase.Idle
  }

  const now = get(nowAtom)
  const [cooldownEndsAt, withdrawEndsAt] = timestamps

  switch (true) {
    case withdrawEndsAt >= now && now > cooldownEndsAt:
      return UnstakePhase.WithdrawWindow
    case cooldownEndsAt >= now:
      return UnstakePhase.CooldownWindow
    default:
      return UnstakePhase.Idle
  }
})
