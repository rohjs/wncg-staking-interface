import {
  SECOND_IN_MS as SECOND,
  MINUTE_IN_MS as MINUTE,
  DAY_IN_MS as DAY,
  HOUR_IN_MS as HOUR,
} from 'constants/time'

export function parseTimeDistance(distance: number) {
  const days = Math.max(0, Math.floor(distance / DAY))
  const hours = Math.max(0, Math.floor((distance % DAY) / HOUR))
  const minutes = Math.max(0, Math.floor((distance % HOUR) / MINUTE))
  const seconds = Math.max(0, Math.floor((distance % MINUTE) / SECOND))

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}
