interface IPeriod {
  from: string
  to: string
}

export interface IPlacements {
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
  placements: IPlacements[]
  creatives: ICreative[]
}
