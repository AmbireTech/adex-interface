export type TabType = 'placements' | 'regions' | 'creatives' | 'timeframe'
export interface IPeriod {
  from: string
  to: string
}

export interface IPlacement {
  id: number
  website: string
  impressions: number
  clicks: number
  ctrPercents: number
  spent: string
  averageCPM: string
}

export interface ICreative {
  id: number
  media: string
  impressions: number
  clicks: number
  ctrPercents: number
  spent: string
}

export interface IRegion {
  id: number
  country: string
  share: number
  impressions: number
  clicks: number
  ctrPercents: number
  averageCPM: string
  spent: string
}

export interface ITimeFrameData {
  [index: string]: any
  date: string
  impressions: number
  clickAndCRT: number
  averageCPM: number
  spent: number
}

export interface ICampaignData {
  id: number
  campaignName: string
  model: string
  status: string
  served: string
  budget: string
  impressions: number
  clicks: number
  ctr: number
  period: IPeriod
  placements: IPlacement[]
  creatives: ICreative[]
  regions: IRegion[]
  timeframe: ITimeFrameData[]
}
