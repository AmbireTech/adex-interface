import { Campaign, EventType, Placement } from 'adex-common'

export type BaseData = {
  impressions: number
  clicks: number
  // clicks / impressions * 100
  ctr?: number
  share?: number
  // paid / impressions * 1000
  avgCpm?: number
  avgCpc?: number
  paid: number
  served?: number
}

export type CampaignData = BaseData & {
  campaignId: string
  campaign: Campaign
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

export type AnalyticsPeriod = {
  start?: Date
  end?: Date
}

export type AnalyticsDataQuery = AnalyticsDataKeys &
  AnalyticsPeriod & {
    eventType: keyof typeof EventType
    metric: Metric
    timeframe: Timeframe
    limit: number
    segmentBy?: keyof AnalyticsDataKeys
    // TODO: validation and test timezones - need tests on validator ad well
    timezone: 'UTC'
  }

export type AnalyticsData = {
  value: string | number
  time: number
  segment?: string
}

export type AnalyticsDataRes = {
  limit?: number
  aggr: AnalyticsData[]
}

export type AggrEvent = {
  channel: string //  DATE STRING - TODO parse
  events: {
    [x in keyof typeof EventType]: {
      eventCounts: {
        [x: string]: number
      }
      eventPayouts: {
        [x: string]: string // currently big num string - TODO number
      }
    }
  }
  totals: {
    [x in keyof typeof EventType]: {
      eventCounts: number
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
  clicks: number
  impressions: number
  payouts: number
}

export type AnalyticsType =
  | 'timeframe'
  | 'hostname'
  | 'country'
  | 'adUnit'
  | 'ssp'
  | 'placement'
  | 'campaignId'
  | 'advertiser'

export type TabType = 'placements' | 'regions' | 'creatives' | 'timeframe'

export type BaseAnalyticsData = BaseData & {
  analyticsType: AnalyticsType
  // time for timeframe analytics,  country name, host name, creative name
  segment: string
  // Only for creatives
  // TODO: need additional map to get the url from adUnit id
  mediaUri?: string
}

export type SSPs = '' | 'Eskimi' | 'Epom' | 'Qortex'
