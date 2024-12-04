import { SSPsAnalyticsData, CampaignUI } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import {
  getCPMRangeAdvancedData,
  parseRange,
  MAGIC_NUMBER,
  cpmToStatisticsPrecision
} from 'helpers/createCampaignHelpers'
import { useMemo, useState, useEffect } from 'react'
import { campaignDataToSSPAnalyticsQuery, DAY } from 'helpers'
import {
  ActionIcon,
  Stack,
  Group,
  Text,
  Tooltip,
  RangeSlider,
  // RingProgress,
  Paper,
  Center,
  Overlay,
  Loader,
  Space,
  NumberFormatter,
  SemiCircleProgress,
  Divider
} from '@mantine/core'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import { Sparkline } from '@mantine/charts'

// NOTE: default value if there is no recent data (no active campaigns past 48 hours)
// Most probably it will be ~ 0.2 but let's keep it lower
const EXPECTED_WINNING_BIDS_RATE = 0.06942

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
      const price = x * MAGIC_NUMBER
      return {
        label: cpmToStatisticsPrecision(price).toString(),
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
      Math.max((cpmData.imps || 0) / (cpmData.bids || 1), EXPECTED_WINNING_BIDS_RATE)
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
            px={6} // TODO:  Magic atm to match the slider fix it with proper theme prop
            h={180}
            data={cpmDistributionChartData}
            // data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]}
            color="info"
            strokeWidth={5}
            curveType="stepAfter"
            fillOpacity={0.69}
          />
          <RangeSlider
            color="info"
            size="xl"
            thumbSize={25}
            value={cpmSliderRange}
            onChange={(val) => {
              setCpmRange(val)
              onCPMRangeChange(cpmRangeData[val[0]]?.label, cpmRangeData[val[1]]?.label)
            }}
            min={0}
            step={1}
            minRange={1}
            max={cpmRangeData[cpmRangeData.length - 1]?.value}
            marks={cpmRangeData}
            label={(val) => cpmRangeData[val]?.label}
            labelAlwaysOn
            styles={{ markLabel: { transform: 'rotate(45deg)', transformOrigin: 'top left' } }}
          />
          <Space h="xl" />

          {/* <Group>
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
            /> */}
          <Group>
            <Stack gap={0}>
              <Tooltip
                label={`CPM range: ${cpmSliderRange[0]} - ${
                  cpmSliderRange[1]
                } covers ${supplyCovered.toFixed(
                  2
                )}% of the total supply matching campaign targeting and creatives formats`}
              >
                <SemiCircleProgress
                  size={200}
                  thickness={16}
                  value={supplyCovered}
                  filledSegmentColor="info"
                  // emptySegmentColor="brandDarker"
                  labelPosition="bottom"
                  // sections={[
                  //   {
                  //     value: supplyCovered,
                  //     color: 'info',
                  //     tooltip: `CPM range: ${cpmSliderRange[0]} - ${
                  //       cpmSliderRange[1]
                  //     } covers ${supplyCovered.toFixed(
                  //       2
                  //     )}% of the total supply matching campaign targeting and creatives formats`
                  //   }
                  // ]}
                  label={
                    <Center>
                      <Text c="info" fw="bolder" ta="center" size="md">
                        Supply <br />
                        {supplyCovered.toFixed(2)}%
                      </Text>
                    </Center>
                  }
                />
              </Tooltip>
              <Divider size={0} label="coverage" />
              <Tooltip
                label={`CPM range: ${cpmSliderRange[0]} - ${cpmSliderRange[1]} covers  ${impressionsCovered}% of the total expected maximum impressions for the selected budged and period of the campaign`}
              >
                <SemiCircleProgress
                  size={200}
                  thickness={16}
                  value={impressionsCovered}
                  orientation="down"
                  filledSegmentColor="success"
                  labelPosition="bottom"
                  // sections={[
                  //   {
                  //     value: impressionsCovered,
                  //     color: 'info',
                  //     tooltip: `CPM range: ${cpmSliderRange[0]} - ${cpmSliderRange[1]} covers  ${impressionsCovered}% of the total expected maximum impressions for the selected budged and period of the campaign`
                  //   }
                  // ]}
                  label={
                    <Center>
                      <Text c="success" fw="bolder" ta="center" size="md">
                        Campaign <br />
                        {impressionsCovered}%
                      </Text>
                    </Center>
                  }
                />
              </Tooltip>
            </Stack>
            <Text>
              {'Expected impressions: Min: '}
              <br />
              <NumberFormatter value={estimatedMinImpressions} thousandSeparator /> {'- Max: '}
              <NumberFormatter value={estimatedMaxImpressions} thousandSeparator />
            </Text>
          </Group>
          {/* </Group> */}
        </Stack>
      </Paper>
    </Stack>
  )
}
