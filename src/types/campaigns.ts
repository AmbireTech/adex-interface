interface IPeriod {
  from: string
  to: string
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
}
