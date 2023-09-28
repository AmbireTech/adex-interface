import { ICreative, IPlacement, IRegion, ITimeFrameData, TabType } from 'types'

interface IHeadersToDataProps {
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
