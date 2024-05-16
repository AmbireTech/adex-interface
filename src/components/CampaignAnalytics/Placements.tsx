import { Placement } from 'adex-common'
import CustomTable from 'components/common/CustomTable'
import { getHumneSrcName } from 'helpers'
import { useMemo } from 'react'
import { BaseAnalyticsData } from 'types'

const Placements = ({
  placements,
  currencyName,
  placement
}: {
  placements: BaseAnalyticsData[] | undefined
  currencyName: string
  placement: Placement
}) => {
  if (!placements?.length) {
    return <div>No placement found</div>
  }

  const headings = useMemo(
    () => [
      placement === 'app' ? 'App' : 'Website',
      'Impressions',
      'Clicks',
      'CTR %',
      'Spent',
      'Average CPM'
    ],
    [placement]
  )

  const elements = useMemo(
    () =>
      placements?.map((item) => ({
        id: item.segment,
        segment: getHumneSrcName(item.segment, placement),
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctr: `${item.ctr}`,
        paid: `${item.paid.toFixed(4)} ${currencyName}`,
        avgCpm: `${item.avgCpm} ${currencyName}`
      })) || [],
    [placements, placement, currencyName]
  )
  return <CustomTable background headings={headings} elements={elements} />
}

export default Placements
