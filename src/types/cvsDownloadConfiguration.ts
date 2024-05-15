export type Hostname = {
  Website: string
  Impressions: string
  Clicks: string
  'CRT%': string
  Spent: string
  'Average CPM': string
}

export type Country = {
  Country: string
  Share: string
  Impressions: string
  Clicks: string
  'CTR%': string
  'Average CPM': string
  Spent: string
}

export type AdUnit = {
  Impressions: string
  Clicks: string
  'CTR%': string
  Spent: string
}

export interface IHeadersToDataProps {
  hostname: Hostname
  country: Country
  adUnit: AdUnit
  timeframe: object
}
