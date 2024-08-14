import {
  Stack,
  Button,
  Group,
  Text,
  Tooltip,
  ActionIcon,
  Checkbox,
  NumberInput,
  Paper
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import {
  AdvancedInputSingle,
  Campaign,
  TargetingInputApplyProp,
  TargetingInputSingle
} from 'adex-common'
import MultiSelectAndRadioButtons from 'components/CreateCampaign/StepTwo/MultiSelectAndRadioButtons'
import { CAT_GROUPS, CATEGORIES, COUNTRIES, REGION_GROUPS } from 'constants/createCampaign'
import { parseBigNumTokenAmountToDecimal, parseToBigNumPrecision } from 'helpers'

import {
  findArrayWithLengthInObjectAsValue,
  getRecommendedCPMRange
} from 'helpers/createCampaignHelpers'
import useAccount from 'hooks/useAccount'
import { useCallback, useEffect, useMemo } from 'react'
import { useCampaignsData } from 'hooks/useCampaignsData'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import throttle from 'lodash.throttle'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'

type TargetingInputEdit = {
  version: string
  inputs: {
    location: TargetingInputSingle
    categories: TargetingInputSingle
    advanced: AdvancedInputSingle
  }
}

type FormProps = {
  pricingBounds: {
    CLICK: { min: number; max: number }
    IMPRESSION: { min: number; max: number }
  }
  targetingInput: TargetingInputEdit
}

const EditCampaign = ({ campaign }: { campaign: Campaign }) => {
  const {
    adexAccount: { balanceToken }
  } = useAccount()
  const { supplyStats, editCampaign } = useCampaignsData()

  const recommendedPaymentBounds = useMemo(
    () => getRecommendedCPMRange(supplyStats, campaign),
    [campaign, supplyStats]
  )

  const form = useForm<FormProps>({
    initialValues: {
      pricingBounds: {
        CLICK: {
          min:
            parseBigNumTokenAmountToDecimal(
              campaign.pricingBounds.CLICK?.min || 0n,
              campaign.outpaceAssetDecimals
            ) * 1000,
          max:
            parseBigNumTokenAmountToDecimal(
              campaign.pricingBounds.CLICK?.max || 0n,
              campaign.outpaceAssetDecimals
            ) * 1000
        },
        IMPRESSION: {
          min:
            parseBigNumTokenAmountToDecimal(
              campaign.pricingBounds.IMPRESSION?.min || 0n,
              campaign.outpaceAssetDecimals
            ) * 1000,
          max:
            parseBigNumTokenAmountToDecimal(
              campaign.pricingBounds.IMPRESSION?.max || 0n,
              campaign.outpaceAssetDecimals
            ) * 1000
        }
      },
      targetingInput: campaign.targetingInput
    },
    validateInputOnBlur: true,
    validate: {
      pricingBounds: {
        IMPRESSION: {
          min: (value, values) => {
            if (!value) return 'CPM Minimum cannot be empty.'
            if (value < 0) return 'Minimum CPM must be greater than or equal to 0'
            if (value > Number(values.pricingBounds.IMPRESSION?.max))
              return 'Minimum CPM cannot be greater than maximum CPM'
            return null
          },
          max: (value, values) => {
            if (!value) return 'CPM Maximum cannot be empty.'
            if (value < 0) return 'Maximum CPM must be greater than or equal to 0'
            if (value < Number(values.pricingBounds.IMPRESSION?.min))
              return 'Maximum CPM cannot be lower than minimum CPM'
            return null
          }
        }
      },
      targetingInput: {
        inputs: {
          location: ({ apply, in: isin, nin }) => {
            if (apply === 'in' && !isin.length) {
              return 'Countries list cannot be empty'
            }
            if (apply === 'nin' && !nin.length) {
              return 'Countries list cannot be empty'
            }
            return null
          },
          categories: ({ apply, in: isin, nin }) => {
            if (apply === 'in' && !isin.length) {
              return 'Categories list cannot be empty'
            }
            if (apply === 'nin' && !nin.length) {
              return 'Categories list cannot be empty'
            }
            return null
          },
          advanced: {
            includeIncentivized: (value) => (typeof value !== 'boolean' ? 'Invalid value' : null),
            disableFrequencyCapping: (value) =>
              typeof value !== 'boolean' ? 'Invalid value' : null,
            limitDailyAverageSpending: (value) =>
              typeof value !== 'boolean' ? 'Invalid value' : null
          }
        }
      }
    }
  })

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      form.isDirty() &&
      (currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search),
    [form]
  )

  const blocker: Blocker = useBlocker(shouldBlock)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      return modals.openConfirmModal(
        defaultConfirmModalProps({
          text: 'You did not save your changes. Are you sure you want to leave this page?',
          color: 'attention',
          labels: { confirm: 'Leave the page', cancel: 'Continue edit' },
          onConfirm: () => {
            blocker.proceed()
          },
          onCancel: () => {
            blocker.reset()
          }
        })
      )
    }
  }, [blocker])

  const catSelectedRadioAndValuesArray = useMemo(
    () => campaign && findArrayWithLengthInObjectAsValue(campaign.targetingInput.inputs.categories),
    [campaign]
  )

  const locSelectedRadioAndValuesArray = useMemo(
    () => campaign && findArrayWithLengthInObjectAsValue(campaign.targetingInput.inputs.location),
    [campaign]
  )

  const handleCategories = useCallback(
    (selectedRadio: TargetingInputApplyProp, categoriesValue: string[]) => {
      form.setFieldValue('targetingInput.inputs.categories', {
        apply: selectedRadio,
        in: selectedRadio === 'in' ? categoriesValue : [],
        nin: selectedRadio === 'nin' ? categoriesValue : []
      })
    },
    [form]
  )

  const handleCountries = useCallback(
    (selectedRadio: TargetingInputApplyProp, locationsValue: string[]) => {
      form.setFieldValue('targetingInput.inputs.location', {
        apply: selectedRadio,
        in: selectedRadio === 'in' ? locationsValue : [],
        nin: selectedRadio === 'nin' ? locationsValue : []
      })
    },
    [form]
  )

  const handleEditCampaign = useCallback(
    async (values: FormProps) => {
      const impression = {
        min: parseToBigNumPrecision(
          Number(values.pricingBounds.IMPRESSION?.min) / 1000,
          balanceToken.decimals
        ),
        max: parseToBigNumPrecision(
          Number(values.pricingBounds.IMPRESSION?.max) / 1000,
          balanceToken.decimals
        )
      }

      const pricingBounds: Partial<Campaign['pricingBounds']> = {
        IMPRESSION: impression
      }
      const inputs: Partial<Campaign['targetingInput']['inputs']> = {
        categories: values.targetingInput.inputs.categories,
        location: values.targetingInput.inputs.location
      }

      const { success } = await editCampaign(campaign.id, pricingBounds, inputs)
      if (success) {
        form.resetDirty()
      }
    },
    [balanceToken.decimals, editCampaign, campaign.id, form]
  )

  const throttledSbm = useMemo(() => {
    return throttle(handleEditCampaign, 3000, { leading: true })
  }, [handleEditCampaign])

  if (!campaign) return <div>Invalid Campaign ID</div>
  return (
    <Paper p="md">
      <form onSubmit={form.onSubmit(throttledSbm)}>
        <Stack gap="xl">
          <Stack gap="xs">
            <Group gap="xs">
              <Text color="secondaryText" size="sm" fw="bold">
                CPM
              </Text>
              <Tooltip
                label={`Recommended CPM: Min - ${recommendedPaymentBounds.min}; Max - ${recommendedPaymentBounds.max}`}
                ml="sm"
              >
                <ActionIcon variant="transparent" color="secondaryText" size="xs">
                  <InfoFilledIcon />
                </ActionIcon>
              </Tooltip>
            </Group>
            <Group align="baseline">
              <NumberInput
                w="196px"
                size="md"
                placeholder="CPM min"
                rightSection={
                  <Text color="brand" mr="sm" size="sm">
                    Min
                  </Text>
                }
                rightSectionWidth="auto"
                name="cpmPricingBoundsMin"
                decimalScale={2}
                {...form.getInputProps('pricingBounds.IMPRESSION.min')}
              />
              <NumberInput
                w="196px"
                size="md"
                placeholder="CPM max"
                inputWrapperOrder={['input', 'description', 'error']}
                rightSection={
                  <Text color="brand" mr="sm" size="sm">
                    Max
                  </Text>
                }
                rightSectionWidth="md"
                name="cpmPricingBoundsMax"
                decimalScale={2}
                {...form.getInputProps('pricingBounds.IMPRESSION.max')}
              />
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text c="secondaryText" size="sm" fw="bold">
              Advanced
            </Text>
            <Group>
              <Checkbox
                label="Limit average daily spending"
                {...form.getInputProps('targetingInput.inputs.advanced.limitDailyAverageSpending', {
                  type: 'checkbox'
                })}
              />
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text c="secondaryText" size="sm" fw="bold">
              Categories
            </Text>
            <MultiSelectAndRadioButtons
              onCategoriesChange={handleCategories}
              multiSelectData={CATEGORIES}
              defaultRadioValue={
                catSelectedRadioAndValuesArray &&
                (catSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
              }
              defaultSelectValue={
                catSelectedRadioAndValuesArray && (catSelectedRadioAndValuesArray[1] as string[])
              }
              groups={CAT_GROUPS}
              label="Categories"
              error={form.errors['targetingInput.inputs.categories']?.toString()}
            />
          </Stack>

          <Stack gap="xs">
            <Text c="secondaryText" size="sm" fw="bold">
              Countries
            </Text>
            <MultiSelectAndRadioButtons
              onCategoriesChange={handleCountries}
              defaultRadioValue={
                locSelectedRadioAndValuesArray &&
                (locSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
              }
              defaultSelectValue={
                locSelectedRadioAndValuesArray && (locSelectedRadioAndValuesArray[1] as string[])
              }
              multiSelectData={COUNTRIES}
              groups={REGION_GROUPS}
              label="Countries"
              error={form.errors['targetingInput.inputs.location']?.toString()}
            />
          </Stack>

          <Button disabled={!form.isDirty()} size="lg" type="submit" maw={200}>
            Save Changes
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}

export default EditCampaign
