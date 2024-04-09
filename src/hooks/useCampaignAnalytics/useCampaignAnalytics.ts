import { useCallback } from 'react'

import { Campaign } from 'adex-common'
import useCampaignsData from 'hooks/useCampaignsData'
import { AnalyticsDataQuery } from 'types/campaignsData'

type AnalyticsType = 'timeframe' | 'placements' | 'country'

const useCampaignAnalytics = () => {
  const { updateCampaignAnalyticsByQuery } = useCampaignsData()

  const getAnalyticsKeyAndUpdate = useCallback(
    (campaign: Campaign, analyticsType: AnalyticsType): string => {
      console.log({ campaign })

      if (!campaign.id || !analyticsType) {
        return ''
      }

      const query: AnalyticsDataQuery = {
        campaignId: campaign.id,
        start: new Date(Number(campaign.activeFrom)),
        end: new Date(Date.now()),
        metric: 'paid',
        eventType: 'CLICK',
        limit: 10000000,
        timezone: 'UTC',
        timeframe: 'year',
        segmentBy: 'campaignId'
      }

      return updateCampaignAnalyticsByQuery(query)
    },
    [updateCampaignAnalyticsByQuery]
  )

  return {
    getAnalyticsKeyAndUpdate
  }
}

export default useCampaignAnalytics
