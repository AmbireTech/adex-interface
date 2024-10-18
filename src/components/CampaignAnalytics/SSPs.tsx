import CustomTable from 'components/common/CustomTable'
import { useMemo } from 'react'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'

const headings = ['SSP', 'Impressions', 'Clicks', 'CTR', 'Average CPM', 'Spent']

const SSPs = ({ forAdmin, campaignId }: { forAdmin: boolean; campaignId: string }) => {
  const { campaignMappedAnalytics, currencyName, error, loading } = useCampaignsAnalyticsData({
    campaignId,
    forAdmin,
    analyticsType: 'ssp'
  })

  const elements = useMemo(
    () =>
      campaignMappedAnalytics?.map((item) => ({
        id: item.segment,
        columns: [
          { value: item.segment },
          { value: item.impressions, element: item.impressions.toLocaleString() },
          { value: item.clicks, element: item.clicks.toLocaleString() },
          { value: item.ctr, element: `${item.ctr} %` },
          { value: item.avgCpm, element: `${item.avgCpm} ${currencyName}` },
          { value: item.paid, element: `${item.paid.toFixed(4)} ${currencyName}` }
        ]
      })) || [],
    [campaignMappedAnalytics, currencyName]
  )

  return <CustomTable headings={headings} data={elements} error={error} loading={loading} />
}

export default SSPs
