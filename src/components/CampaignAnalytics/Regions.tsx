import CustomTableWithDropdown from 'components/common/CustomTableWithDropdown'
import { IPlacements } from 'types'

const headings = ['Website', 'Impressions', 'Clicks', 'CTR%', 'Spent', 'Average CPM']

const Regions = ({ placements }: { placements: IPlacements[] | undefined }) => {
  if (!placements?.length) {
    return <div>No placement found</div>
  }

  const elements = placements?.map((item) => ({
    ...item,
    impressions: item.impressions.toLocaleString(),
    clicks: item.clicks.toLocaleString(),
    ctrPercents: `${item.ctrPercents} %`
  }))
  return <CustomTableWithDropdown background headings={headings} elements={elements} />
}

export default Regions
