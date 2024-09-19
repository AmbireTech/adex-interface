import { useMemo } from 'react'
import CustomTable from 'components/common/CustomTable'
import { Flex, ThemeIcon } from '@mantine/core'
import UrlIcon from 'resources/icons/Url'
import { formatCurrency } from 'helpers'
import { getMediaUrlWithProvider } from 'helpers/createCampaignHelpers'
import MediaThumb from 'components/common/MediaThumb'
import DownloadCSV from 'components/common/DownloadCSV'

import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import CustomAnchor from 'components/common/customAnchor'

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
  const { campaignMappedAnalytics, currencyName, campaign, analyticsKey, loading, error } =
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
        id: item.segment,
        columns: [
          {
            value: media,
            element: (
              <Flex align="center">
                <CustomAnchor external href={media} mr="sm" c="brand">
                  <ThemeIcon variant="transparent" color="brand">
                    <UrlIcon size="25px" />
                  </ThemeIcon>
                </CustomAnchor>
                {unitForId && (
                  <MediaThumb width={30} height={30} adUnit={unitForId} previewOnClick />
                )}
              </Flex>
            )
          },
          {
            value: unitForId?.banner
              ? `${unitForId?.banner?.format.w}x${unitForId?.banner?.format.h}`
              : ''
          },
          { value: item.impressions, element: formatCurrency(item.impressions, 0) },
          { value: item.clicks, element: formatCurrency(item.clicks, 0) },
          { value: item.ctr, element: `${item.ctr}` },
          { value: item.paid, element: `${item.paid.toFixed(2)} ${currencyName}` },
          { value: unitForId?.banner?.targetUrl }
        ]
      }
    })
  }, [campaign, campaignMappedAnalytics, currencyName, loading])

  return (
    <CustomTable
      error={error}
      headings={headings}
      data={elements}
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
  )
}

export default Creatives
