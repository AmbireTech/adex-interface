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
  NumberFormatter
} from '@mantine/core'
import { useMemo, useState, useEffect } from 'react'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import InfoIcon from 'resources/icons/Info'
import DefaultCustomAnchor from 'components/common/customAnchor'
import { campaignDataToSSPAnalyticsQuery } from 'helpers'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import { getRecommendedCPMRangeAdvanced, parseRange } from 'helpers/createCampaignHelpers'
import { SSPsAnalyticsData } from 'types'
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
      value: i
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

  const [cpmRange, setCpmRange] = useState<[number, number]>([0, 1])

  const recommendedCPM = useMemo(
    () =>
      analytics?.data.length
        ? getRecommendedCPMRangeAdvanced(analytics.data, [
            Math.ceil(cpmRange[0] / 10),
            Math.ceil(cpmRange[1] / 10)
          ])
        : { min: 'N/A', max: 'N/A', count: 0 },
    [analytics?.data, cpmRange]
  )

  const budgetIsGreaterThanBalance = useMemo(
    () => errors && errors.budget === 'Available balance is lower than the campaign budget',
    [errors]
  )

  return (
    <Stack gap="xl" maw={720}>
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
          <Tooltip
            label={`Recommended CPM in USD: Min - ${recommendedCPM.min}; Max - ${recommendedCPM.max}`}
            ml="sm"
          >
            <ActionIcon variant="transparent" color="secondaryText" size="xs">
              <InfoFilledIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Stack gap="xl">
          <RangeSlider
            color="blue"
            size="sm"
            value={cpmRange}
            onChange={setCpmRange}
            min={0}
            minRange={0.1}
            max={cpmRangeData[cpmRangeData.length - 1]?.value}
            marks={cpmRangeData}
            label={(value) => cpmRangeData.find((x) => x?.value === value)?.label || ' lll'}
          />
          <Text>
            {`CPM AI analytics USD: Min - ${recommendedCPM.min}; Max - ${recommendedCPM.max}, possible daily impressions: `}{' '}
            <NumberFormatter value={Math.floor(recommendedCPM.count / 2)} thousandSeparator />
          </Text>
        </Stack>
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
  )
}

export default StepThree
