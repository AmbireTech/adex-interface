import { IHeadersToDataProps, BaseAnalyticsData, TabType } from 'types'

const headersToDataProperties: IHeadersToDataProps = {
  placements: {
    Website: 'segment',
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CRT%': 'crt',
    Spent: 'paid',
    'Average CPM': 'avgCpm'
  },
  regions: {
    Country: 'segment',
    Share: 'share',
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CTR%': 'ctr',
    'Average CPM': 'avgCpm',
    Spent: 'paid'
  },
  creatives: {
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CTR%': 'crt',
    Spent: 'paid'
  },
  timeframe: {}
}

// TODO: remove TabType use AnalyticsType
const generateCVSData = (tabName: TabType, tabData: BaseAnalyticsData[] | undefined) => ({
  mapHeadersToDataProperties: headersToDataProperties[tabName],
  tabData,
  filename: `${tabName}.csv`
})

export { generateCVSData }
