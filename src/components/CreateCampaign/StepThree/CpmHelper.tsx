import { SSPsAnalyticsData, CampaignUI } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import { getCPMRangeAdvancedData, parseRange, MAGIC_NUMBER } from 'helpers/createCampaignHelpers'
import { useMemo, useState, useEffect } from 'react'
import { campaignDataToSSPAnalyticsQuery, DAY } from 'helpers'
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
  Loader,
  Space,
  NumberFormatter
} from '@mantine/core'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import { Sparkline } from '@mantine/charts'

// TODO: get some real time stats about that
const EXPECTED_WINNING_BIDS_RATE = 0.05

const getCMPRangeMarks = (analytics: SSPsAnalyticsData[]) => {
  const cpms = analytics
    .map((x) => {
      const { min, max } = parseRange(x.value.toString())
      return [min, max]
    })
    .flat()
    .filter((c) => typeof c === 'number' && !Number.isNaN(c))
    .sort((a, b) => a - b)
    .filter((item, pos, self) => {
      return self.indexOf(item) === pos
    })
    .map((x, i) => {
      console.log({ x })
      return {
        label: (x * MAGIC_NUMBER).toPrecision(2),
        value: i
      }
    })
  return cpms
}

export function CPMHelper({
  campaign,
  onCPMRangeChange
}: {
  campaign: CampaignUI
  onCPMRangeChange: (min: number | string, max: number | string) => void
}) {
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

  const cpmData = useMemo(
    () =>
      analytics?.data.length
        ? getCPMRangeAdvancedData(
            analytics.data,
            Number(cpmRangeData.find((x) => x.value === cpmSliderRange[0])?.label) || 0,
            Number(cpmRangeData.find((x) => x.value === cpmSliderRange[1])?.label) || 0
          )
        : { min: 'N/A', max: 'N/A', count: 0, supply: 0, bids: 0, imps: 0 },
    [analytics?.data, cpmSliderRange, cpmRangeData]
  )

  // console.log({ cpmData })

  const estimatedMaxImpressions = useMemo(() => {
    const totalImps = Math.floor(
      (campaign.budget / (Number(campaign.cpmPricingBounds.min) || 0.1)) * 1000
    )
    return totalImps
  }, [campaign])

  const estimatedMinImpressions = useMemo(() => {
    const totalImps = Math.floor(
      (campaign.budget / (Number(campaign.cpmPricingBounds.max) || 0.1)) * 1000
    )
    return totalImps
  }, [campaign])

  const supplyCovered = useMemo(
    () => (cpmData.count / cpmData.supply) * 100,
    [cpmData.count, cpmData.supply]
  )

  const impressionsCovered = useMemo(() => {
    const dailySupply =
      (cpmData.count / 2) *
      ((cpmData.imps || 0) / (cpmData.bids || 1) || EXPECTED_WINNING_BIDS_RATE)
    const campaignDays = Number(campaign.activeTo - campaign.activeFrom) / DAY
    const dailyImpressions = estimatedMaxImpressions / campaignDays
    const percentCovered = Number(((dailySupply / dailyImpressions) * 100).toFixed(2))

    return percentCovered > 100 ? 100 : percentCovered
  }, [
    campaign.activeFrom,
    campaign.activeTo,
    estimatedMaxImpressions,
    cpmData.bids,
    cpmData.count,
    cpmData.imps
  ])

  const cpmDistributionChartData = useMemo(() => {
    return analytics?.data.length
      ? cpmRangeData.map(
          (_x, i) =>
            getCPMRangeAdvancedData(
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
        <Tooltip
          multiline
          w={220}
          label="This tool will help you select the optimal CPM for your specific campaign. Everything is considered - selected placements, devices, countries, categories and creatives formats"
          ml="sm"
        >
          <ActionIcon variant="transparent" color="info" size="xs">
            <InfoFilledIcon />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Paper shadow="md" p="md" pt="xl" withBorder bg="lightBackground" pos="relative">
        {cpmToolDisabled && (
          <Overlay color="#fff" backgroundOpacity={0.3} blur={3} center>
            <Stack>
              {cpmDataLoading && <Loader type="dots" color="brand" />}
              {!cpmDataLoading && (
                <Text size="xl">Fill period and budget to access CPM helper</Text>
              )}
            </Stack>
          </Overlay>
        )}
        <Stack gap="xs" justify="stretch">
          <Text>Supply CPM distribution</Text>
          <Sparkline
            h={180}
            data={cpmDistributionChartData}
            color="info"
            strokeWidth={5}
            curveType="monotone"
          />
          <Space h="xl" />
          <RangeSlider
            color="info"
            size="xl"
            thumbSize={25}
            value={cpmSliderRange}
            onChange={(val) => {
              console.log({ val })
              setCpmRange(val)
              onCPMRangeChange(cpmRangeData[val[0]]?.label, cpmRangeData[val[1]]?.label)
            }}
            min={0}
            minRange={1}
            max={cpmRangeData[cpmRangeData.length - 1]?.value}
            marks={cpmRangeData}
            label={(val) => cpmRangeData[val]?.label}
            labelAlwaysOn
          />
          <Space h="xl" />
          <Text>
            {'Expected impressions: Min: '}
            <NumberFormatter value={estimatedMinImpressions} thousandSeparator /> {'- Max: '}
            <NumberFormatter value={estimatedMaxImpressions} thousandSeparator />
          </Text>
          <Group>
            <RingProgress
              size={200}
              thickness={16}
              sections={[
                {
                  value: supplyCovered,
                  color: 'info',
                  tooltip: `CPM range: ${cpmSliderRange[0]} - ${
                    cpmSliderRange[1]
                  } covers ${supplyCovered.toFixed(
                    2
                  )}% of the total supply matching campaign targeting and creatives formats`
                }
              ]}
              label={
                <Center>
                  <Text c="info" fw="bolder" ta="center" size="md">
                    Supply <br />
                    {supplyCovered.toFixed(2)}%
                  </Text>
                </Center>
              }
            />

            <RingProgress
              size={200}
              thickness={16}
              sections={[
                {
                  value: impressionsCovered,
                  color: 'info',
                  tooltip: `CPM range: ${cpmSliderRange[0]} - ${cpmSliderRange[1]} covers  ${impressionsCovered}% of the total expected maximum impressions for the selected budged and period of the campaign`
                }
              ]}
              label={
                <Center>
                  <Text c="info" fw="bolder" ta="center" size="md">
                    Campaign <br />
                    {impressionsCovered}%
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
