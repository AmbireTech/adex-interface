import {
  Stack,
  Button,
  Group,
  Text,
  Checkbox,
  NumberInput,
  Paper,
  Tabs,
  SimpleGrid,
  Tooltip,
  ActionIcon
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
import { CAT_GROUPS, CATEGORIES, COUNTRIES, REGION_GROUPS, SSPs } from 'constants/createCampaign'
import { parseBigNumTokenAmountToDecimal, parseToBigNumPrecision } from 'helpers'

import {
  campaignToCampaignUI,
  findArrayWithLengthInObjectAsValue
} from 'helpers/createCampaignHelpers'
import useAccount from 'hooks/useAccount'
import { useCallback, useEffect, useMemo } from 'react'
import { useCampaignsData } from 'hooks/useCampaignsData'
import type { Blocker, BlockerFunction } from 'react-router-dom'
import { useBlocker, useParams, useNavigate } from 'react-router-dom'
import throttle from 'lodash.throttle'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
import Placements from 'components/CampaignAnalytics/Placements'
import DefaultCustomAnchor from 'components/common/customAnchor'
import { CPMHelper } from 'components/CreateCampaign/StepThree/CpmHelper'
import InfoIcon from 'resources/icons/Info'

type TargetingInputEdit = {
  version: string
  inputs: {
    location: TargetingInputSingle
    categories: TargetingInputSingle
    advanced: AdvancedInputSingle
    ssp?: TargetingInputSingle
  }
}

type FormProps = {
  pricingBounds: {
    CLICK: { min: number; max: number }
    IMPRESSION: { min: number; max: number }
  }
  targetingInput: TargetingInputEdit
}

const EditCampaign = ({ campaign, isAdmin }: { campaign: Campaign; isAdmin?: boolean }) => {
  const {
    isAdmin: isAdminEdit,
    adexAccount: { balanceToken }
  } = useAccount()
  const { tabValue = 'budget' } = useParams()
  const navigate = useNavigate()
  const { editCampaign } = useCampaignsData()

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
          ssp: (sspVal) => {
            if (!sspVal) return 'Invalid ssp value'
            if (sspVal.apply === 'in' && !sspVal.in.length) {
              return 'SSP list cannot be empty'
            }
            if (sspVal.apply === 'nin' && !sspVal.nin.length) {
              return 'SSP list cannot be empty'
            }
            return null
          },
          advanced: {
            includeIncentivized: (value) => (typeof value !== 'boolean' ? 'Invalid value' : null),
            disableFrequencyCapping: (value) =>
              typeof value !== 'boolean' ? 'Invalid value' : null,
            limitDailyAverageSpending: (value) =>
              typeof value !== 'boolean' ? 'Invalid value' : null,
            aggressiveBidding: (value) => (typeof value !== 'boolean' ? 'Invalid value' : null),
            looseSourceCTR: (value) => (typeof value !== 'boolean' ? 'Invalid value' : null)
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
      modals.openConfirmModal(
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

  const sspSelectedRadioAndValuesArray = useMemo(
    () =>
      campaign && campaign.targetingInput.inputs.ssp
        ? findArrayWithLengthInObjectAsValue(campaign.targetingInput.inputs.ssp)
        : [],
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

  const handleSSps = useCallback(
    (selectedRadio: TargetingInputApplyProp, sspValue: string[]) => {
      form.setFieldValue('targetingInput.inputs.ssp', {
        apply: selectedRadio,
        in: selectedRadio === 'in' ? sspValue : [],
        nin: selectedRadio === 'nin' ? sspValue : []
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
        location: values.targetingInput.inputs.location,
        advanced: values.targetingInput.inputs.advanced
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
    <Paper p="md" shadow="xs">
      <Tabs
        value={tabValue}
        onChange={(value) =>
          navigate(
            `/dashboard/campaign-details${isAdmin ? '/admin' : ''}/${
              campaign.id
            }/${value}?edit=true`,
            { replace: true }
          )
        }
      >
        <Tabs.List mb="xl">
          <Tabs.Tab value="budget">Budget</Tabs.Tab>
          <Tabs.Tab value="targeting">Targeting</Tabs.Tab>
          <Tabs.Tab value="placements">Placements</Tabs.Tab>
        </Tabs.List>

        <form onSubmit={form.onSubmit(throttledSbm)}>
          <Tabs.Panel value="budget">
            <SimpleGrid cols={{ base: 1, xl: 2 }}>
              <Stack gap="xl" w="100%">
                <Stack gap="xs">
                  <Text c="secondaryText" size="sm" fw="bold">
                    CPM
                  </Text>

                  <Group align="baseline" grow>
                    <NumberInput
                      w="196px"
                      size="md"
                      placeholder="CPM min"
                      rightSection={
                        <Text c="brand" mr="sm" size="sm">
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
                      {...form.getInputProps(
                        'targetingInput.inputs.advanced.limitDailyAverageSpending',
                        {
                          type: 'checkbox'
                        }
                      )}
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
                  <Group>
                    <Checkbox
                      label="Aggressive bidding mode"
                      {...form.getInputProps('targetingInput.inputs.advanced.aggressiveBidding', {
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
                  <Group>
                    <Checkbox
                      label="Bid on low CTR sources"
                      {...form.getInputProps('targetingInput.inputs.advanced.looseSourceCTR', {
                        type: 'checkbox'
                      })}
                    />
                    <Tooltip
                      multiline
                      maw={420}
                      label={`Enabling bidding on sources with a low Clickthrough Rate (CTR) increases the chances of winning bids
                        but may reduce the campaign’s overall CTR. This option is helpful for campaigns focused on brand awareness
                        rather than driving clicks.`}
                    >
                      <ActionIcon size="sm" variant="transparent">
                        <InfoIcon />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Stack>

                <Button disabled={!form.isDirty()} size="lg" type="submit" maw={200}>
                  Save Changes
                </Button>
              </Stack>
              <CPMHelper
                campaign={campaignToCampaignUI(campaign, balanceToken.name)}
                onCPMRangeChange={(min, max) => {
                  form.setFieldValue('pricingBounds.IMPRESSION.min', Number(min))
                  form.setFieldValue('pricingBounds.IMPRESSION.max', Number(max))
                }}
              />
            </SimpleGrid>
          </Tabs.Panel>

          <Tabs.Panel value="targeting">
            <Stack gap="xl">
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
                    catSelectedRadioAndValuesArray &&
                    (catSelectedRadioAndValuesArray[1] as string[])
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
                  onCategoriesChange={handleSSps}
                  defaultRadioValue={
                    locSelectedRadioAndValuesArray &&
                    (locSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
                  }
                  defaultSelectValue={
                    locSelectedRadioAndValuesArray &&
                    (locSelectedRadioAndValuesArray[1] as string[])
                  }
                  multiSelectData={COUNTRIES}
                  groups={REGION_GROUPS}
                  label="SSPs"
                  error={form.errors['targetingInput.inputs.ssp']?.toString()}
                />
              </Stack>

              {isAdminEdit && (
                <Stack gap="xs">
                  <Text c="secondaryText" size="sm" fw="bold">
                    SSPs
                  </Text>
                  <MultiSelectAndRadioButtons
                    onCategoriesChange={handleCountries}
                    groups={{}}
                    defaultRadioValue={
                      sspSelectedRadioAndValuesArray &&
                      (sspSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
                    }
                    defaultSelectValue={
                      sspSelectedRadioAndValuesArray &&
                      (sspSelectedRadioAndValuesArray[1] as string[])
                    }
                    multiSelectData={SSPs}
                    label="SSPs"
                    error={form.errors['targetingInput.inputs.ssp']?.toString()}
                  />
                </Stack>
              )}

              <Button disabled={!form.isDirty()} size="lg" type="submit" maw={200}>
                Save Changes
              </Button>
            </Stack>
          </Tabs.Panel>
        </form>

        <Tabs.Panel value="placements">
          <Placements campaignId={campaign.id} forAdmin={!!isAdmin} />
        </Tabs.Panel>
      </Tabs>
    </Paper>
  )
}

export default EditCampaign
