import { useMemo, useState } from 'react'
import { Group, Modal, Button, Stack } from '@mantine/core'
import { useViewportSize } from '@mantine/hooks'
import { CountryData } from 'helpers/countries'
import CustomTable from 'components/common/CustomTable'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import MapIcon from 'resources/icons/Map'
import DownloadCSV from 'components/common/DownloadCSV'
import GeoCustom from '../common/CustomTableWithDropdown/WorldMap'

const headings = ['Country', 'Share', 'Impressions', 'Clicks', 'CTR', 'Average CPM', 'Spent']

const csvHeaders = {
  Country: 'segment',
  Share: 'share',
  Impressions: 'impressions',
  Clicks: 'clicks',
  'CTR%': 'ctr',
  'Average CPM': 'avgCpm',
  Spent: 'paid'
}

const Regions = ({ campaignId }: { campaignId: string }) => {
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  const { campaignMappedAnalytics, currencyName, analyticsKey, loading } =
    useCampaignsAnalyticsData({
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

  return (
    <Stack gap="xs">
      <Group align="center" justify="end">
        <Button
          variant="transparent"
          color="mainText"
          size="sm"
          onClick={() => setIsMapVisible((prev) => !prev)}
          rightSection={<MapIcon size="1rem" />}
          disabled={loading}
        >
          See on Map{' '}
        </Button>
        <DownloadCSV
          data={campaignMappedAnalytics}
          mapHeadersToDataProperties={csvHeaders}
          filename={`${analyticsKey?.key}.csv`}
          disabled={loading}
        />
        <CustomTable headings={headings} elements={elements} loading={loading} />
      </Group>
      <Modal
        opened={isMapVisible}
        onClose={() => setIsMapVisible(false)}
        title="Word Map"
        centered
        size="100%"
      >
        <GeoCustom width={width} height={height} regions={campaignMappedAnalytics} />
      </Modal>
    </Stack>
  )
}

export default Regions
