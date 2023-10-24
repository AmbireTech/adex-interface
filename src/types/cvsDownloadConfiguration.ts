export interface IHeadersToDataProps {
  placements: {
    Website: string
    Impressions: string
    Clicks: string
    'CRT%': string
    Spent: string
    'Average CPM': string
  }
  regions: {
    Country: string
    Share: string
    Impressions: string
    Clicks: string
    'CTR%': string
    'Average CPM': string
    Spent: string
  }
  creatives: {
    Impressions: string
    Clicks: string
    'CTR%': string
    Spent: string
  }
  timeframe: object
}
