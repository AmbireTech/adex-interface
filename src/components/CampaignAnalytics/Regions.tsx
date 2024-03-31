import { IRegion } from 'types'
import { useMemo } from 'react'
import { Grid, Modal } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import CustomTable from 'components/common/CustomTable'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR%', 'Average CPM', 'Spent']

const Regions = ({
  regions,
  isMapVisible,
  onClose
}: {
  regions: IRegion[] | undefined
  isMapVisible: boolean
  onClose: () => void
}) => {
  const { width: windowWidth, height: windowHeight } = useViewportSize()
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
      <Grid.Col>
        <CustomTable background headings={headings} elements={elements} />
      </Grid.Col>
      <Modal
        opened={isMapVisible}
        onClose={onClose}
        title="Word Map"
        size={windowWidth >= 768 ? windowWidth - 290 : windowWidth - 60}
        padding="lg"
      >
        <GeoCustom
          width={windowWidth >= 768 ? windowWidth - 290 : windowWidth - 60}
          height={windowHeight}
          regions={regions}
        />
      </Modal>
    </Grid>
  )
}

export default Regions
