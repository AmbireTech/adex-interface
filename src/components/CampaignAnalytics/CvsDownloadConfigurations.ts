import { IHeadersToDataProps, BaseAnalyticsData, AnalyticsType } from 'types'

const headersToDataProperties: IHeadersToDataProps = {
  hostname: {
    Website: 'segment',
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CRT%': 'crt',
    Spent: 'paid',
    'Average CPM': 'avgCpm'
  },
  country: {
    Country: 'segment',
    Share: 'share',
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CTR%': 'ctr',
    'Average CPM': 'avgCpm',
    Spent: 'paid'
  },
  adUnit: {
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CTR%': 'crt',
    Spent: 'paid'
  },
  timeframe: {}
}

// TODO: remove TabType use AnalyticsType
const generateCVSData = (tabName: AnalyticsType, tabData: BaseAnalyticsData[] | undefined) => ({
  mapHeadersToDataProperties: headersToDataProperties[tabName],
  tabData,
  filename: `${tabName}.csv`
})

export { generateCVSData }
