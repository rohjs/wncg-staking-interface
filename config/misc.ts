import { bnum } from 'utils/bnum'

export const SECOND = 1
export const MINUTE = SECOND * 60
export const HOUR = MINUTE * 60
export const DAY = HOUR * 24
export const YEAR = DAY * 365
export const MONTH = Math.floor(YEAR / 12)
export const WEEK = Math.floor(YEAR / 52)

export const SECOND_MS = SECOND * 1_000
export const MINUTE_MS = MINUTE * 1_000
export const HOUR_MS = HOUR * 1_000
export const DAY_MS = DAY * 1_000
export const WEEK_MS = WEEK * 1_000
export const MONTH_MS = MONTH * 1_000
export const YEAR_MS = YEAR * 1_000

export const UNIT = bnum(1)
export const PAGE_PER = 5

export const HIGH_PRICE_IMPACT = 0.01

export const REKT_PRICE_IMPACT = 0.2

export const MAX_SLIPPAGE = 30

export const APR_SPAN_LIST = ['day', 'week', 'month', 'year']
export const BASE_GAS_FEE = 0.05
