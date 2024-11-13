import { SSPsAnalyticsData } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import { getRecommendedCPMRangeAdvanced, parseRange } from 'helpers/createCampaignHelpers'
import { useMemo, useState, useEffect } from 'react'
import { campaignDataToSSPAnalyticsQuery, DAY } from 'helpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'

// TODO: get some real time stats about that
const EXPECTED_WINNING_BIDS_RATE = 0.05

const getCMPRangeMarks = (analytics: SSPsAnalyticsData[]) => {
  const cpms = analytics
    .map((x) => [parseRange(x.value.toString()).min, parseRange(x.value.toString()).max])
    .flat()
    .filter((c) => typeof c === 'number' && !Number.isNaN(c))
    .sort((a, b) => a - b)
    .filter((item, pos, self) => {
      return self.indexOf(item) === pos
    })
    .map((x, i) => ({
      label: x.toString(),
      value: i
    }))
  return cpms
}

export function useCPMAnalytics() {
  const {
    campaign
    // form: { key, getInputProps, errors, setFieldValue }
  } = useCreateCampaignContext()

  const { analyticsData, getAnalyticsKeyAndUpdate } = useSSPsAnalytics()

  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
      }
    | undefined
  >()

  const analytics = useMemo(
    () => analyticsData.get(analyticsKey?.key || ''),
    [analyticsData, analyticsKey]
  )

  const cpmRangeData = useMemo(() => getCMPRangeMarks(analytics?.data || []), [analytics?.data])

  useEffect(() => {
    const checkAnalytics = async () => {
      const analKey = await getAnalyticsKeyAndUpdate({
        ...campaignDataToSSPAnalyticsQuery(campaign),
        limit: 666
      })
      setAnalyticsKey(analKey)
    }

    checkAnalytics()
  }, [campaign, getAnalyticsKeyAndUpdate])

  const [cpmSliderRange, setCpmRange] = useState<[number, number]>([0, 1])

  const recommendedCPM = useMemo(
    () =>
      analytics?.data.length
        ? getRecommendedCPMRangeAdvanced(
            analytics.data,
            Number(cpmRangeData.find((x) => x.value === cpmSliderRange[0])?.label) || 0,
            Number(cpmRangeData.find((x) => x.value === cpmSliderRange[1])?.label) || 0
          )
        : { min: 'N/A', max: 'N/A', count: 0, supply: 0 },
    [analytics?.data, cpmSliderRange, cpmRangeData]
  )

  const estimatedMaxImpressions = useMemo(() => {
    return (campaign.budget / Number(campaign.cpmPricingBounds.min || 1)) * 1000
  }, [campaign])

  const impressionsCovered = useMemo(() => {
    return +(
      (((recommendedCPM.count / 2) * (Number(campaign.activeTo - campaign.activeFrom) / DAY)) /
        estimatedMaxImpressions) *
      100 *
      EXPECTED_WINNING_BIDS_RATE
    ) // We expect yo
      .toPrecision(2)
  }, [campaign.activeFrom, campaign.activeTo, estimatedMaxImpressions, recommendedCPM.count])

  const cpmDistributionChartData = useMemo(() => {
    return analytics?.data.length
      ? cpmRangeData.map(
          (_x, i) =>
            getRecommendedCPMRangeAdvanced(
              analytics?.data,
              Number(cpmRangeData[i]?.label),
              Number(cpmRangeData[i + 1]?.label || cpmRangeData[i]?.label)
            )?.count || 1
        )
      : []
  }, [analytics?.data, cpmRangeData])

  const cpmDataLoading = useMemo(() => !analytics || analytics?.status === 'loading', [analytics])

  const cpmToolDisabled = useMemo(() => {
    return cpmDataLoading || !campaign.activeFrom || !campaign.activeTo || !campaign.budget
  }, [campaign.activeFrom, campaign.activeTo, campaign.budget, cpmDataLoading])

  return {
    cpmRangeData,
    recommendedCPM,
    cpmSliderRange,
    setCpmRange,
    impressionsCovered,
    cpmDistributionChartData,
    cpmDataLoading,
    cpmToolDisabled
  }
}
