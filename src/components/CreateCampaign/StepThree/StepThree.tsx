import {
  ActionIcon,
  Alert,
  Checkbox,
  Flex,
  Grid,
  Group,
  Radio,
  Text,
  TextInput,
  Tooltip
} from '@mantine/core'
import { useCallback, useMemo } from 'react'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import {
  // CAMPAIGN_DISABLE_FREQUENCY_CAPPING_INPUT,
  // CAMPAIGN_INCLUDE_INCENTIVIZED_INPUT,
  CAMPAIGN_LIMIT_DAILY_AVERAGE_SPENDING_INPUT
} from 'constants/createCampaign'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { parseRange } from 'helpers/createCampaignHelpers'
import InfoIcon from 'resources/icons/Info'
import DefaultCustomAnchor from 'components/common/customAnchor'
import CampaignPeriod from './CampaignPeriod'
import SelectCurrency from './SelectCurrency'

const StepThree = () => {
  const {
    campaign: {
      asapStartingDate,
      targetingInput: {
        inputs: {
          advanced: {
            // disableFrequencyCapping,
            //  includeIncentivized,
            limitDailyAverageSpending
          }
        }
      }
    },
    updateCampaign,
    updateCampaignWithPrevStateNested,
    selectedBidFloors,
    form
  } = useCreateCampaignContext()

  const recommendedPaymentBounds = useMemo(() => {
    const rangeUnparsed = selectedBidFloors.flat().sort((a, b) => b.count - a.count)[0]?.value

    return rangeUnparsed ? parseRange(rangeUnparsed) : { min: 'N/A', max: 'N/A' }
  }, [selectedBidFloors])

  const handleTargetInputAdvanced = useCallback(
    (key: string, value: boolean) => {
      updateCampaignWithPrevStateNested(key, value)
    },
    [updateCampaignWithPrevStateNested]
  )

  const budgetIsGreaterThanBalance = useMemo(
    () =>
      form.errors &&
      form.errors.campaignBudget === 'Available balance is lower than the campaign budget',
    [form.errors]
  )

  return (
    <Grid>
      <Grid.Col mb="md">
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          1. Campaign Period
        </Text>
        <CampaignPeriod />
      </Grid.Col>

      <Grid.Col>
        <Alert icon={<InfoIcon style={{ marginTop: 0 }} />} color="attention" variant="outline">
          <Text>
            The campaigns go through a approval process and if you select &quot;As soon as
            possible&quot; the campaign will be launched once it is approved.
          </Text>
        </Alert>
      </Grid.Col>
      <Grid.Col>
        <Checkbox
          checked={asapStartingDate}
          label="As soon as possible"
          onChange={(event) => updateCampaign('asapStartingDate', event.currentTarget.checked)}
        />
      </Grid.Col>
      <Grid.Col mb="md">
        <Radio.Group
          label={
            <Text c="secondaryText" size="sm" fw="bold">
              2. Payment Model
            </Text>
          }
          key={form.key('paymentModel')}
          {...form.getInputProps('paymentModel')}
        >
          <Group mt="xs">
            <Radio value="cpm" label="CPM" />
            {/* Disabled at the moment */}
            {/* <Radio value="cpc" label="CPC" /> */}
          </Group>
        </Radio.Group>
      </Grid.Col>
      <Grid.Col mb="md">
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          3. Currency
        </Text>
        <SelectCurrency
          defaultValue={form.values.currency}
          onChange={(value) => form.setFieldValue('currency', value)}
          error={(form.errors.currency && form.errors.currency) || ''}
        />
      </Grid.Col>
      <Grid.Col mb="md">
        <Flex justify="space-between" align="flex-start">
          <TextInput
            label={
              <Text c="secondaryText" size="sm" fw="bold" mb="xs">
                4. Campaign Budget
              </Text>
            }
            size="md"
            w={{ sm: '100%', lg: '50%' }}
            placeholder="Campaign Budget"
            // TODO: Should get/calculate estimated fee
            // description={`Estimated fee: 0.15 ${balanceToken.name}`}
            inputWrapperOrder={['label', 'input', 'description', 'error']}
            name="campaignBudget"
            key={form.key('campaignBudget')}
            {...form.getInputProps('campaignBudget')}
          />
          {budgetIsGreaterThanBalance && (
            <InfoAlertMessage
              mt={{ sm: 'sm', lg: '0' }}
              w={{ sm: '100%', lg: '40%' }}
              message="You have insufficient funds in your account for launching a campaign. Top up your account from here. Your campaign has been automatically saved in drafts."
            />
          )}
        </Flex>
        <Group my="sm">
          <Checkbox
            checked={limitDailyAverageSpending}
            label="Limit average daily spending"
            onChange={(event) =>
              handleTargetInputAdvanced(
                CAMPAIGN_LIMIT_DAILY_AVERAGE_SPENDING_INPUT,
                event.currentTarget.checked
              )
            }
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
      </Grid.Col>
      <Grid.Col mb="md">
        <Group mb="xs" gap="xs">
          <Text c="secondaryText" size="sm" fw="bold">
            5. CPM
          </Text>
          <Tooltip
            label={`Recommended CPM in USD: Min - ${recommendedPaymentBounds.min}; Max - ${recommendedPaymentBounds.max}`}
            ml="sm"
          >
            <ActionIcon variant="transparent" color="secondaryText" size="xs">
              <InfoFilledIcon />
            </ActionIcon>
          </Tooltip>
        </Group>
        <Flex wrap="nowrap" justify="space-between" maw={{ sm: '100%', lg: '50%' }}>
          <TextInput
            size="md"
            w="45%"
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
            key={form.key('cpmPricingBounds.min')}
            {...form.getInputProps('cpmPricingBounds.min')}
          />
          <TextInput
            size="md"
            w="45%"
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
            key={form.key('cpmPricingBounds.max')}
            {...form.getInputProps('cpmPricingBounds.max')}
          />
        </Flex>
      </Grid.Col>
      <Grid.Col mb="md">
        <TextInput
          label={
            <Text c="secondaryText" size="sm" fw="bold" mb="xs">
              6. Campaign Name
            </Text>
          }
          size="md"
          maw={{ sm: '100%', lg: '50%' }}
          placeholder="Campaign Name"
          name="title"
          key={form.key('title')}
          {...form.getInputProps('title')}
        />
      </Grid.Col>
      {/* <Grid.Col mb="md">
          <Text color="secondaryText" size="sm" weight="bold">
            7. Advanced options
          </Text>
          <Group my="sm">
            <Checkbox
              checked={includeIncentivized}
              label="Include incentivized traffic"
              onChange={(event) =>
                handleTargetInputAdvanced(
                  CAMPAIGN_INCLUDE_INCENTIVIZED_INPUT,
                  event.currentTarget.checked
                )
              }
            />
          </Group>
          <Group my="sm">
            <Checkbox
              checked={disableFrequencyCapping}
              label="Disable frequency capping"
              onChange={(event) =>
                handleTargetInputAdvanced(
                  CAMPAIGN_DISABLE_FREQUENCY_CAPPING_INPUT,
                  event.currentTarget.checked
                )
              }
            />
          </Group>
          <Group my="sm">
            <Checkbox
              checked={limitDailyAverageSpending}
              label="Limit average daily spending"
              onChange={(event) =>
                handleTargetInputAdvanced(
                  CAMPAIGN_LIMIT_DAILY_AVERAGE_SPENDING_INPUT,
                  event.currentTarget.checked
                )
              }
            />
          </Group>
        </Grid.Col> */}
    </Grid>
  )
}

export default StepThree
