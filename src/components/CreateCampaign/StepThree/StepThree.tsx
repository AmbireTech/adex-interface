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
  Tooltip
} from '@mantine/core'
import { useMemo } from 'react'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { parseRange } from 'helpers/createCampaignHelpers'
import InfoIcon from 'resources/icons/Info'
import DefaultCustomAnchor from 'components/common/customAnchor'
import CampaignPeriod from './CampaignPeriod'
import SelectCurrency from './SelectCurrency'

const StepThree = () => {
  const {
    campaign: { currency },
    selectedBidFloors,
    form: { key, getInputProps, errors, setFieldValue }
  } = useCreateCampaignContext()

  const recommendedPaymentBounds = useMemo(() => {
    const rangeUnparsed = selectedBidFloors.flat().sort((a, b) => b.count - a.count)[0]?.value

    return rangeUnparsed ? parseRange(rangeUnparsed) : { min: 'N/A', max: 'N/A' }
  }, [selectedBidFloors])

  const budgetIsGreaterThanBalance = useMemo(
    () => errors && errors.budget === 'Available balance is lower than the campaign budget',
    [errors]
  )

  return (
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
          defaultValue={currency}
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
            label={`Recommended CPM in USD: Min - ${recommendedPaymentBounds.min}; Max - ${recommendedPaymentBounds.max}`}
            ml="sm"
          >
            <ActionIcon variant="transparent" color="secondaryText" size="xs">
              <InfoFilledIcon />
            </ActionIcon>
          </Tooltip>
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
