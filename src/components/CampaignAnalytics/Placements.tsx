import CustomTable from 'components/common/CustomTable'
import { useMemo } from 'react'
import { BaseAnalyticsData } from 'types'

const headings = ['Hostname', 'Website', 'Impressions', 'Clicks', 'CTR%', 'Spent', 'Average CPM']

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
        ...item,
        avgCpm: `${item.avgCpm} ${currencyName}`,
        paid: `${item.paid} ${currencyName}`,
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctr: `${item.ctr} %`
      })) || [],
    [placements, currencyName]
  )
  return <CustomTable background headings={headings} elements={elements} />
}

export default Placements
