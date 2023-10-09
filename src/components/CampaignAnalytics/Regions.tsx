import { IRegion } from 'types'
// import { ParentSize } from '@visx/responsive'
import { Grid } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import useWindowSize from 'hooks/useWindowSize'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR%', 'Average CPM', 'Spent']

const Regions = ({
  regions,
  isMapVisible
}: {
  regions: IRegion[] | undefined
  isMapVisible: boolean
}) => {
  const [windowWidth] = useWindowSize()
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
        <Grid.Col h={420} mb="sm">
          <GeoCustom
            width={windowWidth >= 768 ? windowWidth - 290 : windowWidth - 60}
            height={420}
            regions={regions}
          />
        </Grid.Col>
      )}
      <Grid.Col>
        <CustomTable background headings={headings} elements={elements} />
      </Grid.Col>
    </Grid>
  )
}

export default Regions
