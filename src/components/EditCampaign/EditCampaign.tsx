import {
  Grid,
  Button,
  createStyles,
  Group,
  Text,
  Tooltip,
  ActionIcon,
  Checkbox,
  Flex,
  NumberInput
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import {
  AdvancedInputSingle,
  Campaign,
  TargetingInputApplyProp,
  TargetingInputSingle
} from 'adex-common'
import { CustomConfirmModal } from 'components/common/Modals'
import MultiSelectAndRadioButtons from 'components/CreateCampaign/StepTwo/MultiSelectAndRadioButtons'
import { CAT_GROUPS, CATEGORIES, COUNTRIES, REGION_GROUPS } from 'constants/createCampaign'
import { parseBigNumTokenAmountToDecimal, parseToBigNumPrecision } from 'helpers'

import {
  findArrayWithLengthInObjectAsValue,
  updateCatsLocsObject
} from 'helpers/createCampaignHelpers'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import useCustomNotifications from 'hooks/useCustomNotifications'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import InfoFilledIcon from 'resources/icons/InfoFilled'

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.xs,
    overflow: 'hidden',
    padding: theme.spacing.lg
  }
}))

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

const EditCampaign = ({
  campaign,
  onAfterSubmit
}: {
  campaign: Campaign
  onAfterSubmit?: () => void
}) => {
  const { adexServicesRequest } = useAdExApi()
  const { showNotification } = useCustomNotifications()
  const { classes } = useStyles()
  const {
    adexAccount: { balanceToken }
  } = useAccount()

  const recommendedPaymentBounds = { min: '0.10', max: '0.5' }

  const blocker: Blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) =>
        currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search,
      []
    )
  )

  const blockerProceed = useCallback(() => blocker.proceed?.(), [blocker])

  const handleConfirmBtnClicked = useCallback(async () => {
    modals.closeAll()
    blockerProceed()
  }, [blockerProceed])

  const handleCancelBtnClicked = useCallback(() => {
    modals.closeAll()
  }, [])

  const [openedModal, setOpenedModal] = useState(false)
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
            if (apply === 'in') {
              if (!isin.length) return 'Countries list cannot be empty'
              return null
            }
            if (apply === 'nin') {
              if (!nin.length) return 'Countries list cannot be empty'
              return null
            }
            return null
          },
          categories: ({ apply, in: isin, nin }) => {
            if (apply === 'in') {
              if (!isin.length) return 'Categories list cannot be empty'
              return null
            }
            if (apply === 'nin') {
              if (!nin.length) return 'Categories list cannot be empty'
              return null
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

  useEffect(() => {
    if (blocker.state === 'blocked' && form.isDirty()) {
      setOpenedModal(true)
      return
    }
    blockerProceed()
  }, [blocker, blockerProceed])

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
      form.setFieldValue(
        'targetingInput.inputs.categories',
        updateCatsLocsObject(selectedRadio, categoriesValue)
      )
      form.validateField('targetingInput.inputs.categories')
    },
    [campaign]
  )

  const handleCountries = useCallback(
    (selectedRadio: TargetingInputApplyProp, locationsValue: string[]) => {
      form.setFieldValue(
        'targetingInput.inputs.location',
        updateCatsLocsObject(selectedRadio, locationsValue)
      )
      form.validateField('targetingInput.inputs.location')
    },
    [campaign]
  )

  const editCampaign = useCallback((values: FormProps) => {
    const impression = {
      min: Number(
        parseToBigNumPrecision(
          Number(values.pricingBounds.IMPRESSION?.min) / 1000,
          balanceToken.decimals
        )
      ),
      max: Number(
        parseToBigNumPrecision(
          Number(values.pricingBounds.IMPRESSION?.max) / 1000,
          balanceToken.decimals
        )
      )
    }

    const body: FormProps = {
      pricingBounds: {
        CLICK: { min: 0, max: 0 },
        IMPRESSION: impression
      },
      targetingInput: {
        version: '1',
        inputs: {
          categories: values.targetingInput.inputs.categories,
          location: values.targetingInput.inputs.location,
          advanced: {
            disableFrequencyCapping: values.targetingInput.inputs.advanced.disableFrequencyCapping,
            includeIncentivized: values.targetingInput.inputs.advanced.includeIncentivized,
            limitDailyAverageSpending:
              values.targetingInput.inputs.advanced.limitDailyAverageSpending
          }
        }
      }
    }

    return adexServicesRequest('backend', {
      route: `/dsp/campaigns/edit/${campaign.id}`,
      method: 'PUT',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(() => {
        showNotification('info', 'Successfully updated Campaign data!')
        form.resetDirty()
        onAfterSubmit && onAfterSubmit()
      })
      .catch(() => showNotification('error', "Couldn't update the Campaign data!"))
  }, [])

  if (!campaign) return <div>Invalid Campaign ID</div>
  return (
    <>
      <Grid mx="lg" my="sm">
        <form onSubmit={form.onSubmit(editCampaign)}>
          <Grid mt="xl" gutter="xl" className={classes.container}>
            <Grid.Col mb="md">
              <Group mb="xs" spacing="xs">
                <Text color="secondaryText" size="sm" weight="bold">
                  CPM
                </Text>
                <Tooltip
                  label={`Recommended CPM: Min - ${recommendedPaymentBounds.min}; Max - ${recommendedPaymentBounds.max}`}
                  ml="sm"
                >
                  <ActionIcon color="secondaryText" size="xs">
                    <InfoFilledIcon />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Flex mb="md" gap="md">
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
                  {...form.getInputProps('pricingBounds.IMPRESSION.min')}
                  onBlur={() => form.validateField('pricingBounds.IMPRESSION.min')}
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
                  {...form.getInputProps('pricingBounds.IMPRESSION.max')}
                  onBlur={() => form.validateField('pricingBounds.IMPRESSION.max')}
                />
              </Flex>
            </Grid.Col>
            <Grid.Col mb="md">
              <Text color="secondaryText" size="sm" weight="bold" mb="xs">
                Advanced
              </Text>
              <Group my="sm">
                <Checkbox
                  label="Include incentivized traffic"
                  {...form.getInputProps('targetingInput.inputs.advanced.includeIncentivized', {
                    type: 'checkbox'
                  })}
                />
              </Group>
              <Group my="sm">
                <Checkbox
                  label="Disable frequency capping"
                  {...form.getInputProps('targetingInput.inputs.advanced.disableFrequencyCapping', {
                    type: 'checkbox'
                  })}
                />
              </Group>
              <Group my="sm">
                <Checkbox
                  label="Limit average daily spending"
                  {...form.getInputProps(
                    'targetingInput.inputs.advanced.limitDailyAverageSpending',
                    {
                      type: 'checkbox'
                    }
                  )}
                />
              </Group>
            </Grid.Col>
            <Grid.Col onBlur={() => form.validateField('targetingInput.inputs.categories')}>
              <Text color="secondaryText" size="sm" weight="bold" mb="xs">
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
            </Grid.Col>
            <Grid.Col onBlur={() => form.validateField('targetingInput.inputs.location')}>
              <Text color="secondaryText" size="sm" weight="bold" mb="xs">
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
            </Grid.Col>

            <Group mt="lg">
              <Button size="lg" type="submit">
                Save Changes
              </Button>
            </Group>
          </Grid>
        </form>
      </Grid>
      <CustomConfirmModal
        cancelBtnLabel="Cancel"
        confirmBtnLabel="Go back"
        onCancelClicked={handleCancelBtnClicked}
        onConfirmClicked={handleConfirmBtnClicked}
        color="attention"
        text={
          <div style={{ textAlign: 'center' }}>
            You did not save your changes. Are you sure you want to leave this page?
          </div>
        }
        opened={openedModal}
      />
    </>
  )
}

export default EditCampaign
