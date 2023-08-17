import CustomTableWithDropdown from 'components/common/CustomTableWithDropdown'
import { IRegion } from 'types'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR%', 'Average CPM', 'Spent']

const Regions = ({ regions }: { regions: IRegion[] | undefined }) => {
  if (!regions?.length) {
    return <div>No placement found</div>
  }

  const elements = regions?.map((item) => ({
    ...item,
    impressions: item.impressions.toLocaleString(),
    clicks: item.clicks.toLocaleString(),
    ctrPercents: `${item.ctrPercents} %`
  }))
  return <CustomTableWithDropdown background headings={headings} elements={elements} />
}

export default Regions
