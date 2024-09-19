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
        segment: item.segment,
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctr: `${item.ctr} %`,
        avgCpm: `${item.avgCpm} ${currencyName}`,
        paid: `${item.paid.toFixed(4)} ${currencyName}`
      })) || [],
    [campaignMappedAnalytics, currencyName]
  )

  if (!campaignMappedAnalytics?.length) {
    return <div>No placement found</div>
  }
  return <CustomTable headings={headings} elements={elements} error={error} loading={loading} />
}

export default SSPs
