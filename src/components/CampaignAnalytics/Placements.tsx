import CustomTable from 'components/common/CustomTable'
import { useMemo } from 'react'
import { BaseAnalyticsData } from 'types'

const headings = ['Hostname', 'Impressions', 'Clicks', 'CTR%', 'Spent', 'Average CPM']

const Placements = ({
  placements,
  currencyName
}: {
  placements: BaseAnalyticsData[] | undefined
  currencyName: string
}) => {
  if (!placements?.length) {
    return <div>No placement found</div>
  }

  const elements = useMemo(
    () =>
      placements?.map((item) => ({
        segment: item.segment,
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctr: `${item.ctr} %`,
        paid: `${item.paid} ${currencyName}`,
        avgCpm: `${item.avgCpm} ${currencyName}`
      })) || [],
    [placements, currencyName]
  )
  return <CustomTable background headings={headings} elements={elements} />
}

export default Placements
