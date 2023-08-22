import CustomTableWithDropdown from 'components/common/CustomTableWithDropdown'
import { IRegion } from 'types'
import { ParentSize } from '@visx/responsive'
import { Grid } from '@mantine/core'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

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
  return (
    <Grid grow>
      <Grid.Col h={420}>
        <ParentSize>
          {({ height, width }) => (
            <GeoCustom width={width} height={height} events regions={regions} />
          )}
        </ParentSize>
      </Grid.Col>
      <Grid.Col>
        <CustomTableWithDropdown background headings={headings} elements={elements} />
      </Grid.Col>
    </Grid>
  )
}

export default Regions
