import { Timeframe } from 'types'

export const SECOND = 1000
export const MINUTE = 60 * SECOND
export const HOUR = 60 * MINUTE
export const DAY = 24 * HOUR
export const WEEK = 7 * DAY
export const MONTH = 30 * DAY
export const YEAR = 356 * DAY

export function getTimeframeMaxPeriod(timeframe: Timeframe) {
  if (timeframe === 'year') return YEAR
  if (timeframe === 'month') return YEAR / 12
  if (timeframe === 'week') return 7 * DAY
  if (timeframe === 'day') return DAY
  return DAY
}

export function getEpoch(timestamp: number, floor: number): number {
  return Math.floor(timestamp / floor) * floor
}

export function getPeriodInitialEpoch(timestamp: number): number {
  return getEpoch(timestamp, HOUR)
}
