import { useMemo, useState } from 'react'
import { Grid, Modal, Button } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { CountryData } from 'helpers/countries'
import CustomTable from 'components/common/CustomTable'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import MapIcon from 'resources/icons/Map'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR', 'Average CPM', 'Spent']

const Regions = ({ campaignId }: { campaignId: string }) => {
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  const { campaignMappedAnalytics, currencyName } = useCampaignsAnalyticsData({
    campaignId,
    analyticsType: 'country'
  })
  const { width, height } = useViewportSize()

  const elements = useMemo(() => {
    if (!campaignMappedAnalytics) {
      return []
    }
    const paid = campaignMappedAnalytics?.reduce((sum, i) => sum + i.paid, 0) || 1

    return (
      campaignMappedAnalytics?.map((item) => ({
        segment: CountryData.get(item.segment)?.name,
        share: `${((item.paid / paid) * 100).toFixed(2)} %`,
        impressions: item.impressions,
        clicks: item.clicks,
        ctr: `${item.ctr} %`,
        avgCpm: `${item.avgCpm} ${currencyName}`,
        paid: `${item.paid.toFixed(4)} ${currencyName}`
      })) || []
    )
  }, [campaignMappedAnalytics, currencyName])

  if (!campaignMappedAnalytics?.length) {
    return <div>No regions found</div>
  }

  return (
    <Grid grow>
      <Grid.Col>
        <Button
          variant="transparent"
          color="mainText"
          size="xs"
          onClick={() => setIsMapVisible((prev) => !prev)}
          rightSection={<MapIcon size="1rem" />}
        >
          See on Map{' '}
        </Button>
        <CustomTable headings={headings} elements={elements} />
      </Grid.Col>
      <Modal
        opened={isMapVisible}
        onClose={() => setIsMapVisible(false)}
        title="Word Map"
        centered
        size="100%"
      >
        <GeoCustom width={width} height={height} regions={campaignMappedAnalytics} />
      </Modal>
    </Grid>
  )
}

export default Regions
