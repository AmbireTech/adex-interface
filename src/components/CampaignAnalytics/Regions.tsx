import { IRegion } from 'types'
import { ParentSize } from '@visx/responsive'
import { Grid } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR%', 'Average CPM', 'Spent']

const Regions = ({
  regions,
  isMapVisible
}: {
  regions: IRegion[] | undefined
  isMapVisible: boolean
}) => {
  if (!regions?.length) {
    return <div>No regions found</div>
  }

  const elements = regions?.map((item) => ({
    ...item,
    impressions: item.impressions.toLocaleString(),
    clicks: item.clicks.toLocaleString(),
    ctrPercents: `${item.ctrPercents} %`
  }))
  return (
    <Grid grow>
      {isMapVisible && (
        <Grid.Col h={420}>
          <ParentSize>
            {({ height, width }) => (
              <GeoCustom width={width / 2} height={height} regions={regions} />
            )}
          </ParentSize>
        </Grid.Col>
      )}
      <Grid.Col>
        <CustomTable background headings={headings} elements={elements} />
      </Grid.Col>
    </Grid>
  )
}

export default Regions
