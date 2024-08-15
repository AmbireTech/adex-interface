import { useEffect, useState, useMemo } from 'react'
import { Campaign } from 'adex-common'
import useAccount from 'hooks/useAccount'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { BaseAnalyticsData, AnalyticsPeriod, AnalyticsType } from 'types'

export function useCampaignsAnalyticsData({
  campaignId,
  analyticsType,
  forAdmin
}: {
  campaignId: string
  analyticsType: AnalyticsType
  forAdmin?: boolean
}) {
  const { getAnalyticsKeyAndUpdate, mappedAnalytics } = useCampaignAnalytics()
  const { campaignsData, updateCampaignDataById } = useCampaignsData()
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
        period: AnalyticsPeriod
      }
    | undefined
  >()

  const {
    adexAccount: {
      fundsOnCampaigns: { perCampaign }
    }
  } = useAccount()

  const currencyName = useMemo(
    () =>
      campaignId && !!perCampaign.length
        ? perCampaign.find((item) => item.id === campaignId)?.token.name || ''
        : '',
    [campaignId, perCampaign]
  )

  const campaign: Campaign | undefined = useMemo(
    () => (campaignId ? campaignsData.get(campaignId)?.campaign : undefined),
    [campaignId, campaignsData]
  )

  const totalPaid: number = useMemo(
    () => (campaignId ? campaignsData.get(campaignId)?.paid || 0 : 0),
    [campaignId, campaignsData]
  )

  const campaignMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || ''),
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    if (campaignId) {
      console.log({ campaignId })
      updateCampaignDataById(campaignId)
    }
  }, [campaignId, updateCampaignDataById])

  useEffect(() => {
    if (!campaign) return
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate(analyticsType, campaign, !!forAdmin)
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [analyticsType, campaign, getAnalyticsKeyAndUpdate, forAdmin])

  const loading = useMemo(
    () => !analyticsKey || !campaignMappedAnalytics,
    [analyticsKey, campaignMappedAnalytics]
  )

  return { campaignMappedAnalytics, totalPaid, campaign, loading, currencyName, analyticsKey }
}
