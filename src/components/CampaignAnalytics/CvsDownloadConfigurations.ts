import { ICreative, IHeadersToDataProps, IPlacement, IRegion, ITimeFrameData, TabType } from 'types'

const headersToDataProperties: IHeadersToDataProps = {
  placements: {
    Website: 'website',
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CRT%': 'ctrPercents',
    Spent: 'spent',
    'Average CPM': 'averageCPM'
  },
  regions: {
    Country: 'country',
    Share: 'share',
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CTR%': 'ctrPercents',
    'Average CPM': 'averageCPM',
    Spent: 'spent'
  },
  creatives: {
    Impressions: 'impressions',
    Clicks: 'clicks',
    'CTR%': 'ctrPercents',
    Spent: 'spent'
  },
  timeframe: {}
}

const generateCVSData = (
  tabName: TabType,
  tabData: IPlacement[] | IRegion[] | ICreative[] | ITimeFrameData[] | undefined
) => ({
  mapHeadersToDataProperties: headersToDataProperties[tabName],
  tabData,
  filename: `${tabName}.csv`
})

export { generateCVSData }
