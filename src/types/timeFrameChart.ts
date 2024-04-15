import { BaseAnalyticsData } from 'types'

export type XYChartProps = {
  width: number
  height: number
  timeFrameData: BaseAnalyticsData[]
  // TODO: Add type for it
  metricsToShow: any
}

export type Metrics = 'Impressions' | 'Clicks and CRT' | 'Average CPM' | 'Total spent'
