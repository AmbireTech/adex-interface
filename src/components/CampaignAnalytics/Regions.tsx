import { BaseAnalyticsData } from 'types'
import { useMemo } from 'react'
import { Grid, Modal } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import CustomTable from 'components/common/CustomTable'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR%', 'Average CPM', 'Spent']

const Regions = ({
  regions,
  isMapVisible,
  currencyName,
  onClose
}: {
  regions: BaseAnalyticsData[] | undefined
  isMapVisible: boolean
  currencyName: string
  onClose: () => void
}) => {
  const { width: windowWidth, height: windowHeight } = useViewportSize()

  // TODO: add elements types, fix custom table data
  const elements = useMemo(
    () =>
      regions?.map((item) => ({
        segment: item.segment,
        share: '-',
        impressions: item.impressions,
        clicks: item.clicks,
        ctr: `${item.ctr} %`,
        avgCpm: `${item.avgCpm} ${currencyName}`,
        paid: `${item.paid} ${currencyName}`
      })) || [],
    [regions, currencyName]
  )

  if (!regions?.length) {
    return <div>No regions found</div>
  }

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
