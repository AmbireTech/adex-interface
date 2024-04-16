import { BaseAnalyticsData } from 'types'

export type Partial<T> = {
  [P in keyof T]?: T[P]
}

export type FilteredAnalytics = Partial<
  Omit<BaseAnalyticsData, 'mediaUri' | 'analyticsType' | 'segment'>
> & {
  segment: string
}

export type XYChartProps = {
  width: number
  height: number
  timeFrameData: FilteredAnalytics[]
  // TODO: Add type for it
  metricsToShow: any
}

export type Metrics = 'Impressions' | 'Clicks and CRT' | 'Average CPM' | 'Total spent'
