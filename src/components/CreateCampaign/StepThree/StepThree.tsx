import {
  ActionIcon,
  Alert,
  Checkbox,
  Stack,
  Group,
  NumberInput,
  Radio,
  Text,
  TextInput,
  Tooltip,
  RangeSlider,
  NumberFormatter,
  RingProgress,
  Paper,
  Center
} from '@mantine/core'
import { useMemo, useState, useEffect } from 'react'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import InfoIcon from 'resources/icons/Info'
import DefaultCustomAnchor from 'components/common/customAnchor'
import { campaignDataToSSPAnalyticsQuery, DAY } from 'helpers'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import { getRecommendedCPMRangeAdvanced, parseRange } from 'helpers/createCampaignHelpers'
import { SSPsAnalyticsData } from 'types'
import { Sparkline } from '@mantine/charts'
import CampaignPeriod from './CampaignPeriod'
import SelectCurrency from './SelectCurrency'

const getCMPRangeLabel = (analytics: SSPsAnalyticsData[]) => {
  const cpms = analytics
    .map((x) => [parseRange(x.value.toString()).min, parseRange(x.value.toString()).max])
    .flat()
    .filter((c) => typeof c === 'number' && !Number.isNaN(c))
    .sort((a, b) => a - b)
    .filter((item, pos, self) => {
      return self.indexOf(item) === pos
    })
    .map((x, i) => ({
      label: x,
      value: i,
      index: 1
    }))
  return cpms
}

const StepThree = () => {
  const {
    campaign,
    form: { key, getInputProps, errors, setFieldValue }
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

  const cpmRangeData = useMemo(() => getCMPRangeLabel(analytics?.data || []), [analytics?.data])

  useEffect(() => {
    setAnalyticsKey(undefined)

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
            cpmRangeData.find((x) => x.value === cpmSliderRange[0])?.label || 0,
            cpmRangeData.find((x) => x.value === cpmSliderRange[1])?.label || 0
          )
        : { min: 'N/A', max: 'N/A', count: 0, supply: 0 },
    [analytics?.data, cpmSliderRange, cpmRangeData]
  )

  const budgetIsGreaterThanBalance = useMemo(
    () => errors && errors.budget === 'Available balance is lower than the campaign budget',
    [errors]
  )

  const estimatedMaxImpressions = useMemo(() => {
    return (campaign.budget / Number(campaign.cpmPricingBounds.min || 1)) * 1000
  }, [campaign])

  const impressionsCovered = useMemo(() => {
    return +(
      (((recommendedCPM.count / 2) * (Number(campaign.activeTo - campaign.activeFrom) / DAY)) /
        estimatedMaxImpressions) *
      100
    ).toPrecision(2)
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

  console.log({ cpmDistributionChartData })

  return (
    <Group align="top" grow>
      <Stack gap="xl">
        <Stack gap="xs">
          <Text c="secondaryText" size="sm" fw="bold">
            1. Campaign Period
          </Text>
          <CampaignPeriod />

          <Alert icon={<InfoIcon style={{ marginTop: 0 }} />} color="attention" variant="outline">
            <Text>
              The campaigns go through a approval process and if you select &quot;As soon as
              possible&quot; the campaign will be launched once it is approved.
            </Text>
          </Alert>

          <Checkbox
            label="As soon as possible"
            key={key('asapStartingDate')}
            {...getInputProps('asapStartingDate', {
              type: 'checkbox'
            })}
          />
        </Stack>

        <Radio.Group
          label={
            <Text c="secondaryText" size="sm" fw="bold">
              2. Payment Model
            </Text>
          }
          key={key('paymentModel')}
          {...getInputProps('paymentModel')}
        >
          <Group mt="xs">
            <Radio value="cpm" label="CPM" />
            {/* Disabled at the moment */}
            {/* <Radio value="cpc" label="CPC" /> */}
          </Group>
        </Radio.Group>

        <Stack gap="xs">
          <Text c="secondaryText" size="sm" fw="bold">
            3. Currency
          </Text>
          <SelectCurrency
            defaultValue={campaign.currency}
            onChange={(value) => setFieldValue('currency', value)}
            error={(errors.currency && errors.currency) || ''}
          />
        </Stack>

        <Stack gap="xs">
          <NumberInput
            allowDecimal
            hideControls
            label={
              <Text c="secondaryText" size="sm" fw="bold" mb="xs">
                4. Campaign Budget
              </Text>
            }
            size="md"
            placeholder="Enter campaign budget"
            // TODO: Should get/calculate estimated fee
            // description={`Estimated fee: 0.15 ${balanceToken.name}`}
            inputWrapperOrder={['label', 'input', 'description', 'error']}
            name="budget"
            key={key('budget')}
            {...getInputProps('budget')}
          />
          {budgetIsGreaterThanBalance && (
            <InfoAlertMessage message="You have insufficient funds in your account for launching a campaign. You can save the campaign as draft and launch it when your account is topped up." />
          )}

          <Group>
            <Checkbox
              label="Limit average daily spending"
              key={key('targetingInput.inputs.advanced.limitDailyAverageSpending')}
              {...getInputProps('targetingInput.inputs.advanced.limitDailyAverageSpending', {
                type: 'checkbox'
              })}
            />
            <DefaultCustomAnchor
              href="https://help.adex.network/hc/en-us/articles/15014607423260-How-to-limit-your-average-daily-spend"
              external
              c="blue"
              size="sm"
            >
              (learn more)
            </DefaultCustomAnchor>
          </Group>
        </Stack>

        <Stack gap="xs">
          <Group gap="xs">
            <Text c="secondaryText" size="sm" fw="bold">
              5. CPM
            </Text>
          </Group>

          <Group wrap="nowrap" justify="stretch" grow>
            <TextInput
              size="md"
              placeholder="CPM min"
              // Temporary disabled until we are ready to get real data
              // description="Approx. ~ $0.10"
              inputWrapperOrder={['input', 'description', 'error']}
              rightSection={
                <Text c="brand" mr="sm" size="sm">
                  Min
                </Text>
              }
              rightSectionWidth="auto"
              name="cpmPricingBounds.min"
              key={key('cpmPricingBounds.min')}
              {...getInputProps('cpmPricingBounds.min')}
            />
            <TextInput
              size="md"
              placeholder="CPM max"
              // Temporary disabled until we are ready to get real data
              // description="Approx. ~ $0.50"
              inputWrapperOrder={['input', 'description', 'error']}
              rightSection={
                <Text c="brand" mr="sm" size="sm">
                  Max
                </Text>
              }
              rightSectionWidth="md"
              name="cpmPricingBounds.max"
              key={key('cpmPricingBounds.max')}
              {...getInputProps('cpmPricingBounds.max')}
            />
          </Group>
          <Group>
            <Checkbox
              label="Aggressive bidding mode"
              key={key('targetingInput.inputs.advanced.limitDailyAverageSpending')}
              {...getInputProps('targetingInput.inputs.advanced.aggressiveBidding', {
                type: 'checkbox'
              })}
            />
            <DefaultCustomAnchor
              href="https://help.adex.network/hc/en-us/articles/16075705207068-What-is-aggressive-bidding"
              external
              c="blue"
              size="sm"
            >
              (learn more)
            </DefaultCustomAnchor>
          </Group>
        </Stack>

        <TextInput
          label={
            <Text c="secondaryText" size="sm" fw="bold" mb="xs">
              6. Campaign Name
            </Text>
          }
          size="md"
          placeholder="Campaign Name"
          name="title"
          key={key('title')}
          {...getInputProps('title')}
        />
      </Stack>

      <Stack gap="xs">
        <Group>
          <Text size="sm">🔮 AI CPM helper ✨</Text>
          <Tooltip label="Play with the CPM if you want play" ml="sm">
            <ActionIcon variant="transparent" color="#50baba" size="xs">
              <InfoFilledIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Paper shadow="md" p="md" pt="xl" withBorder bg="lightBackground">
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
              minRange={0.1}
              max={cpmRangeData[cpmRangeData.length - 1]?.value}
              marks={cpmRangeData}
              label={(value) => cpmRangeData.find((x) => x?.value === value)?.label || ' lll'}
            />

            <Text mt="xl">
              {`CPM AI analytics USD: Min - ${recommendedCPM.min}; Max - ${recommendedCPM.max}, supply cover `}{' '}
              <NumberFormatter value={Math.floor(recommendedCPM.count / 2)} thousandSeparator />
            </Text>
            <Group>
              <Stack>
                <Text>Supply covered</Text>
                <RingProgress
                  size={140}
                  thickness={16}
                  sections={[
                    {
                      value: (recommendedCPM.count / recommendedCPM.supply) * 100,
                      color: '#50baba'
                    }
                  ]}
                  label={
                    <Center>
                      <Text c="#50baba" fw="bolder" ta="center" size="xl">
                        {((recommendedCPM.count / recommendedCPM.supply) * 100).toPrecision(2)}%
                      </Text>
                    </Center>
                  }
                />
              </Stack>
              <Stack>
                <Text>
                  Impressions covered (Max:{' '}
                  <NumberFormatter value={estimatedMaxImpressions} thousandSeparator />)
                </Text>
                <RingProgress
                  size={140}
                  thickness={16}
                  sections={[
                    {
                      value: impressionsCovered > 100 ? 100 : impressionsCovered,
                      color: '#50baba'
                    }
                  ]}
                  label={
                    <Center>
                      <Text c="#50baba" fw="bolder" ta="center" size="xl">
                        {impressionsCovered > 100 ? 100 : impressionsCovered}%
                      </Text>
                    </Center>
                  }
                />
              </Stack>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Group>
  )
}

export default StepThree
