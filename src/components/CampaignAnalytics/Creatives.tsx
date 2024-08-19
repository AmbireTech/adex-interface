import { useMemo } from 'react'
import CustomTable from 'components/common/CustomTable'
import { Flex, Anchor, Stack } from '@mantine/core'
import UrlIcon from 'resources/icons/Url'
import { formatCurrency } from 'helpers'
import { getMediaUrlWithProvider } from 'helpers/createCampaignHelpers'
import MediaThumb from 'components/common/MediaThumb'
import DownloadCSV from 'components/common/DownloadCSV'

import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const headings = ['Media', 'Size', 'Impressions', 'Clicks', 'CTR %', 'Spent', 'Target']
const csvHeaders = {
  Creative: 'segment',
  Impressions: 'impressions',
  Clicks: 'clicks',
  'CTR%': 'crt',
  Spent: 'paid'
}

const Creatives = ({ forAdmin, campaignId }: { forAdmin: boolean; campaignId: string }) => {
  const { campaignMappedAnalytics, currencyName, campaign, analyticsKey, loading } =
    useCampaignsAnalyticsData({
      campaignId,
      forAdmin,
      analyticsType: 'adUnit'
    })

  const elements = useMemo(() => {
    if (loading || !campaignMappedAnalytics || !campaign) {
      return []
    }
    return campaignMappedAnalytics?.map((item) => {
      const unitForId = campaign?.adUnits?.find((x) => x.id === item.segment)
      const media = getMediaUrlWithProvider(unitForId?.banner?.mediaUrl, IPFS_GATEWAY) || ''

      return {
        media: (
          <Flex align="center">
            <Anchor href={media} target="_blank" mr="sm" c="brand">
              <UrlIcon size="25px" color="inherit" />
            </Anchor>
            {unitForId && <MediaThumb adUnit={unitForId} previewOnClick />}
          </Flex>
        ),
        size: unitForId?.banner
          ? `${unitForId?.banner?.format.w}x${unitForId?.banner?.format.h}`
          : '',
        impressions: formatCurrency(item.impressions, 0),
        clicks: formatCurrency(item.clicks, 0),
        ctr: `${item.ctr}`,
        paid: `${item.paid.toFixed(2)} ${currencyName}`,
        link: unitForId?.banner?.targetUrl
      }
    })
  }, [campaign, campaignMappedAnalytics, currencyName, loading])

  return (
    <Stack gap="xs">
      <CustomTable
        headings={headings}
        elements={elements}
        loading={loading}
        tableActions={
          <DownloadCSV
            data={campaignMappedAnalytics}
            mapHeadersToDataProperties={csvHeaders}
            filename={`${analyticsKey?.key}.csv`}
            disabled={loading}
          />
        }
      />
    </Stack>
  )
}

export default Creatives
