import CustomTable from 'components/common/CustomTable'
import { useMemo } from 'react'
import { IPlacement } from 'types'

const headings = ['Website', 'Impressions', 'Clicks', 'CTR%', 'Spent', 'Average CPM']

const Placements = ({ placements }: { placements: IPlacement[] | undefined }) => {
  if (!placements?.length) {
    return <div>No placement found</div>
  }

  const elements = useMemo(
    () =>
      placements?.map((item) => ({
        ...item,
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctrPercents: `${item.ctrPercents} %`
      })),
    [placements]
  )
  return <CustomTable background headings={headings} elements={elements} />
}

export default Placements
