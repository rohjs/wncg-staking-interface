import { MouseEvent, useCallback } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import store from 'store'

import {
  EstimatedEarnPeriod,
  estimatedEarnPeriodState,
  mutedState,
  slippageState,
} from 'app/states/settings'
import STORAGE_KEYS from 'constants/storageKeys'
import { gaEvent } from 'lib/gtag'

export function useSettings() {
  const setEstimatedEarnPeriod = useSetRecoilState(estimatedEarnPeriodState)
  const setMuted = useSetRecoilState(mutedState)
  const setSlippage = useSetRecoilState(slippageState)

  const resetEstimatedEarnPeriod = useResetRecoilState(estimatedEarnPeriodState)
  const resetMuted = useResetRecoilState(mutedState)
  const resetSlippage = useResetRecoilState(slippageState)

  const toggleMuted = useCallback(() => {
    setMuted((prev) => {
      store.set(STORAGE_KEYS.UserSettings.Muted, !prev)
      gaEvent({
        name: 'mute_sound',
        params: {
          muted: !prev,
        },
      })
      return !prev
    })
  }, [setMuted])

  const updateEstimatedEarnPeriod = useCallback(
    <T extends HTMLButtonElement>(e: MouseEvent<T>) => {
      const { value: newPeriod } = e.currentTarget as T & {
        value: EstimatedEarnPeriod
      }

      setEstimatedEarnPeriod(newPeriod)
      store.set(STORAGE_KEYS.UserSettings.EstimatedEarnPeriod, newPeriod)
      gaEvent({
        name: 'estimated_earn_period',
        params: {
          period: newPeriod,
        },
      })
    },
    [setEstimatedEarnPeriod]
  )

  const updateSlippage = useCallback(
    (value: string | null) => {
      const newSlippage = value ? Number(value) : null

      setSlippage(newSlippage)
      store.set(STORAGE_KEYS.UserSettings.Slippage, newSlippage)
      gaEvent({
        name: 'slippage',
        params: {
          period: newSlippage,
        },
      })
    },
    [setSlippage]
  )

  const resetSettings = useCallback(() => {
    resetEstimatedEarnPeriod()
    resetMuted()
    resetSlippage()
    store.remove(STORAGE_KEYS.UserSettings.EstimatedEarnPeriod)
    store.remove(STORAGE_KEYS.UserSettings.Muted)
    store.remove(STORAGE_KEYS.UserSettings.Slippage)
  }, [resetEstimatedEarnPeriod, resetMuted, resetSlippage])

  return {
    resetSettings,
    toggleMuted,
    updateEstimatedEarnPeriod,
    updateSlippage,
  }
}
