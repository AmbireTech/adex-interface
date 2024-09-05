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
  const { getAnalyticsKeyAndUpdate, mappedAnalytics, initialAnalyticsLoading } =
    useCampaignAnalytics()
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
    () => mappedAnalytics.get(analyticsKey?.key || '')?.data,
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    console.log('useCampaignsAnalyticsData', { campaignId, analyticsType, forAdmin })
  }, [analyticsType, campaignId, forAdmin])

  useEffect(() => {
    if (campaignId && !campaign?.id) {
      console.log({ campaignId })
      updateCampaignDataById(campaignId)
    }
  }, [campaign?.id, campaignId, updateCampaignDataById])

  useEffect(() => {
    if (!campaign?.id) return
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate(analyticsType, campaign, !!forAdmin)
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [analyticsType, campaign, getAnalyticsKeyAndUpdate, forAdmin])

  const loading = useMemo(
    () => initialAnalyticsLoading || !analyticsKey || !campaignMappedAnalytics,
    [analyticsKey, campaignMappedAnalytics, initialAnalyticsLoading]
  )

  const error = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || '')?.status === 'error',
    [analyticsKey?.key, mappedAnalytics]
  )

  return {
    campaignMappedAnalytics,
    totalPaid,
    campaign,
    loading,
    currencyName,
    analyticsKey,
    error
  }
}
