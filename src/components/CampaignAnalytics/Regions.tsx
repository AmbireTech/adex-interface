import { BaseAnalyticsData } from 'types'
import { useMemo } from 'react'
import { Grid, Modal } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { CountryData } from 'helpers/countries'
import CustomTable from 'components/common/CustomTable'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR', 'Average CPM', 'Spent']

const Regions = ({
  regions,
  isMapVisible,
  currencyName,
  totalPaid,
  onClose
}: {
  regions: BaseAnalyticsData[] | undefined
  isMapVisible: boolean
  currencyName: string
  totalPaid: number
  onClose: () => void
}) => {
  const { width: windowWidth, height: windowHeight } = useViewportSize()

  // TODO: add elements types, fix custom table data
  const elements = useMemo(() => {
    const paid = regions?.reduce((sum, i) => sum + i.paid, 0) || 1
    // TODO: investigate analytics timeframe edge case
    console.log(totalPaid)
    return (
      regions?.map((item) => ({
        segment: CountryData.get(item.segment),
        share: `${((item.paid / paid) * 100).toFixed(2)} %`,
        impressions: item.impressions,
        clicks: item.clicks,
        ctr: `${item.ctr} %`,
        avgCpm: `${item.avgCpm} ${currencyName}`,
        paid: `${item.paid.toFixed(4)} ${currencyName}`
      })) || []
    )
  }, [regions, totalPaid, currencyName])

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
