import { useMemo, useState } from 'react'
import { Group, Modal, Button, Box } from '@mantine/core'
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

const Regions = ({ forAdmin, campaignId }: { forAdmin: boolean; campaignId: string }) => {
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  const { campaignMappedAnalytics, currencyName, analyticsKey, loading, error } =
    useCampaignsAnalyticsData({
      campaignId,
      forAdmin,
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
        id: item.segment,
        columns: [
          { value: CountryData.get(item.segment)?.name },
          {
            value: item.paid / paid,
            element: `${((item.paid / paid) * 100).toFixed(2)} %`
          },
          { value: item.impressions },
          { value: item.clicks },
          { value: item.ctr, element: `${item.ctr} %` },
          { value: item.avgCpm, element: `${item.avgCpm} ${currencyName}` },
          { value: item.paid, element: `${item.paid.toFixed(4)} ${currencyName}` }
        ]
      })) || []
    )
  }, [campaignMappedAnalytics, currencyName])

  return (
    <Box>
      <CustomTable
        error={error}
        headings={headings}
        data={elements}
        loading={loading}
        tableActions={
          <Group align="center" justify="end" gap="xs">
            <Button
              variant="transparent"
              color="mainText"
              size="sm"
              onClick={() => setIsMapVisible((prev) => !prev)}
              rightSection={<MapIcon size="1rem" />}
              disabled={loading}
            >
              See on Map
            </Button>
            <DownloadCSV
              data={campaignMappedAnalytics}
              mapHeadersToDataProperties={csvHeaders}
              filename={`${analyticsKey?.key}.csv`}
              disabled={loading}
            />
          </Group>
        }
      />

      <Modal
        opened={isMapVisible}
        onClose={() => setIsMapVisible(false)}
        title="Word Map"
        centered
        size="100%"
      >
        <GeoCustom width={width} height={height} regions={campaignMappedAnalytics} />
      </Modal>
    </Box>
  )
}

export default Regions
