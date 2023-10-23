import { IRegion } from 'types'
import { useMemo } from 'react'
import { Grid } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
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
  const { width: windowWidth } = useViewportSize()
  if (!regions?.length) {
    return <div>No regions found</div>
  }

  const elements = useMemo(
    () =>
      regions?.map((item) => ({
        ...item,
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctrPercents: `${item.ctrPercents} %`
      })),
    [regions]
  )

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
