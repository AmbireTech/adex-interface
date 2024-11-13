import { SSPsAnalyticsData } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import { getRecommendedCPMRangeAdvanced, parseRange } from 'helpers/createCampaignHelpers'
import { useMemo, useState, useEffect } from 'react'
import { campaignDataToSSPAnalyticsQuery, DAY } from 'helpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import {
  ActionIcon,
  Stack,
  Group,
  Text,
  Tooltip,
  RangeSlider,
  RingProgress,
  Paper,
  Center,
  Overlay,
  Loader
} from '@mantine/core'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import { Sparkline } from '@mantine/charts'

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

export function CPMHelper() {
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

  return (
    <Stack gap="xs">
      <Group>
        <Text size="sm">🔮 AI CPM helper ✨</Text>
        <Tooltip label="Play with the CPM if you want play" ml="sm">
          <ActionIcon variant="transparent" color="#50baba" size="xs">
            <InfoFilledIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Paper shadow="md" p="md" pt="xl" withBorder bg="lightBackground" pos="relative">
        {cpmToolDisabled && (
          <Overlay
            gradient="linear-gradient(145deg, #ffffffaa 0%, #50babaaa 100%)"
            backgroundOpacity={0.9}
            blur={3}
            center
          >
            <Stack>
              {cpmDataLoading && <Loader type="dots" color="brand" />}
              {!cpmDataLoading && (
                <Text size="xl">Fill period and budget to access CPM helper</Text>
              )}
            </Stack>
          </Overlay>
        )}
        <Stack gap="xs">
          <Sparkline
            h={160}
            data={cpmDistributionChartData}
            color="#50baba"
            strokeWidth={5}
            curveType="monotone"
          />
          <RangeSlider
            color="#50baba"
            size="xl"
            value={cpmSliderRange}
            onChange={setCpmRange}
            min={0}
            minRange={1}
            max={cpmRangeData[cpmRangeData.length - 1]?.value}
            marks={cpmRangeData}
          />

          <Text size="xl" mt="xl">
            CPM range: {cpmSliderRange[0]} - {cpmSliderRange[1]}
          </Text>
          <Group>
            <RingProgress
              size={160}
              thickness={16}
              sections={[
                {
                  value: (recommendedCPM.count / recommendedCPM.supply) * 100,
                  color: '#50baba',
                  tooltip: `CPM range: ${cpmSliderRange[0]} - ${cpmSliderRange[1]} covers ${(
                    (recommendedCPM.count / recommendedCPM.supply) *
                    100
                  ).toFixed(
                    2
                  )}% of the total supply matching campaign targeting and creatives formats`
                }
              ]}
              label={
                <Center>
                  <Text c="#50baba" fw="bolder" ta="center" size="md">
                    Supply <br />
                    {((recommendedCPM.count / recommendedCPM.supply) * 100).toFixed(2)}%
                  </Text>
                </Center>
              }
            />

            <RingProgress
              size={160}
              thickness={16}
              sections={[
                {
                  value: impressionsCovered > 100 ? 100 : impressionsCovered,
                  color: '#50baba',
                  tooltip: `CPM range: ${cpmSliderRange[0]} - ${cpmSliderRange[1]} covers  ${
                    impressionsCovered > 100 ? 100 : impressionsCovered
                  }% of the total expected impressions for the selected budged and period of the campaign`
                }
              ]}
              label={
                <Center>
                  <Text c="#50baba" fw="bolder" ta="center" size="md">
                    Campaign <br />
                    {impressionsCovered > 100 ? 100 : impressionsCovered}%
                  </Text>
                </Center>
              }
            />
          </Group>
        </Stack>
      </Paper>
    </Stack>
  )
}
