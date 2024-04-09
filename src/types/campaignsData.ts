import { Campaign, EventType, Placement } from 'adex-common'

export type CampaignData = {
  campaignId: string
  campaign: Campaign
  impressions: Number
  clicks: Number
  // clicks / impressions * 100
  crt: Number
  // payed / impressions * 1000
  avgCpm: Number
  payed: Number
  // TODO: analyticsData type
  analyticsData: any
}

export type Timeframe = 'year' | 'month' | 'week' | 'day' | 'hour'
export type Metric = 'count' | 'paid'

export type AnalyticsDataKeys = {
  campaignId?: string
  adUnit?: string
  adSlot?: string
  adSlotType?: string
  advertiser?: string
  publisher?: string
  ssp?: string
  sspPublisher?: string
  hostname?: string
  placement?: Placement
  country?: string
  osName?: string
}

export type AnalyticsDataQuery = AnalyticsDataKeys & {
  eventType: keyof typeof EventType
  metric: Metric
  timeframe: Timeframe
  start: Date
  end: Date
  limit: number
  segmentBy?: keyof AnalyticsDataKeys
  // TODO: validation and test timezones - need tests on validator ad well
  timezone: 'UTC'
}

export type AnalyticsData = {
  value: string | Number
  time: number
  segment?: string
}

export type AnalyticsDataRes = {
  limit?: Number
  aggr: AnalyticsData[]
}

export type AggrEvent = {
  channel: string //  DATE STRING - TODO parse
  events: {
    [x in keyof typeof EventType]: {
      eventCounts: {
        [x: string]: Number
      }
      eventPayouts: {
        [x: string]: string // currently big num string - TODO number
      }
    }
  }
  totals: {
    [x in keyof typeof EventType]: {
      eventCounts: Number
      eventPayouts: string
    }
  }
}

export type EventAggregatesDataRes = {
  channel: {
    id: string
    // NOTE: skip the rest props
  }
  events: AggrEvent[] // NOTE - use only [0] atm
}

export type EvAggrData = {
  clicks: Number
  impressions: Number
  payouts: BigInt
}
