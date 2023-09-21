import { ITimeFrameData } from 'types'

export type XYChartProps = {
  width: number
  height: number
  timeFrameData: ITimeFrameData[]
  // TODO: Add type for it
  metricsToShow: any
}

export type Metrics = 'Impressions' | 'Clicks and CRT' | 'Average CPM' | 'Total spent'
