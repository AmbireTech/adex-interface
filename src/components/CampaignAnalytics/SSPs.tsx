import CustomTable from 'components/common/CustomTable'
import { useMemo } from 'react'
import { BaseAnalyticsData } from 'types'

const SSPs = ({
  data,
  currencyName
}: {
  data: BaseAnalyticsData[] | undefined
  currencyName: string
}) => {
  if (!data?.length) {
    return <div>No placement found</div>
  }

  const headings = useMemo(
    () => ['SSP', 'Impressions', 'Clicks', 'CTR', 'Average CPM', 'Spent'],
    []
  )

  const elements = useMemo(
    () =>
      data?.map((item) => ({
        id: item.segment,
        segment: item.segment,
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctr: `${item.ctr} %`,
        avgCpm: `${item.avgCpm} ${currencyName}`,
        paid: `${item.paid.toFixed(4)} ${currencyName}`
      })) || [],
    [data, currencyName]
  )
  return <CustomTable background headings={headings} elements={elements} />
}

export default SSPs
