import { ActionIcon, Button, Grid, Group, Text, Tooltip } from '@mantine/core'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import InfoFilledIcon from 'resources/icons/InfoFilled'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useAccount from 'hooks/useAccount'
import {
  validateCPMMax,
  validateCPMMin,
  validateCampaignBudget,
  validateCurrency,
  validatePaymentModel,
  validateTitle
} from 'helpers/validators'
import { CampaignUI } from 'types'
import CampaignPeriod from './CampaignPeriod'
import PaymentModel from './PaymentModel'
import SelectCurrency from './SelectCurrency'
import CampaignBudget from './CampaignBudget'
import CpmMinMax from './CpmMinMax'
import CampaignName from './CampaignName'

// TODO: move all the types in types file

type InputValuesProps = {
  paymentModel: string
  currency: string
  campaignBudget: bigint
  cpmPricingBoundsMin: string
  cpmPricingBoundsMax: string
  title: string
}

type FormErrorsProps = {
  paymentModel: string
  currency: string
  campaignBudget: string
  cpmPricingBoundsMin: string
  cpmPricingBoundsMax: string
  title: string
}

const DEFAULT_ERROR_VALUES: FormErrorsProps = {
  paymentModel: '',
  currency: '',
  campaignBudget: '',
  cpmPricingBoundsMin: '',
  cpmPricingBoundsMax: '',
  title: ''
}

const StepThree = () => {
  const {
    campaign: {
      step,
      paymentModel,
      currency,
      campaignBudget,
      cpmPricingBounds: { min, max },
      title
    },
    updatePartOfCampaign
  } = useCreateCampaignContext()

  const {
    adexAccount: { availableBalance, balanceToken }
  } = useAccount()

  const defaultValue: InputValuesProps = useMemo(
    () => ({
      paymentModel,
      currency,
      campaignBudget,
      cpmPricingBoundsMin: min,
      cpmPricingBoundsMax: max,
      title
    }),
    [paymentModel, currency, campaignBudget, min, max, title]
  )
  // TODO: remove inputValues
  const [inputValues, setInputValues] = useState<InputValuesProps>({ ...defaultValue })
  const [errors, setErrors] = useState<FormErrorsProps>({
    ...DEFAULT_ERROR_VALUES
  })

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target
      let updatedValue: Partial<CampaignUI>
      if (name === 'cpmPricingBoundsMin') {
        if (Number.isNaN(parseFloat(value))) return
        updatedValue = {
          cpmPricingBounds: {
            min: value,
            max
          }
        }
      } else if (name === 'cpmPricingBoundsMax') {
        if (Number.isNaN(parseFloat(value))) return
        updatedValue = {
          cpmPricingBounds: {
            min,
            max: value
          }
        }
      } else {
        updatedValue = { [name]: value }
      }

      updatePartOfCampaign({ ...updatedValue })
      // TODO: remove inputValues
      setInputValues((prev) => {
        return { ...prev, [name]: value }
      })
    },
    [updatePartOfCampaign, min, max]
  )

  console.log('inputValues', inputValues)

  const handleOnFocus = useCallback(
    (name: string) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: ''
      }))
    },

    []
  )

  // TODO: Move the validateFields in other file
  const validateFields = useCallback(() => {
    const newErrors = { ...DEFAULT_ERROR_VALUES }

    const paymentModelValidation = validatePaymentModel(inputValues.paymentModel)
    if (!paymentModelValidation.isValid) newErrors.paymentModel = paymentModelValidation.errMsg

    const currencyValidation = validateCurrency(inputValues.currency)
    if (!currencyValidation.isValid) newErrors.currency = currencyValidation.errMsg

    const campaignBudgetValidation = validateCampaignBudget(
      inputValues.campaignBudget,
      availableBalance,
      balanceToken.decimals
    )
    if (!campaignBudgetValidation.isValid)
      newErrors.campaignBudget = campaignBudgetValidation.errMsg

    const cpmPricingBoundsMinValidation = validateCPMMin(
      inputValues.cpmPricingBoundsMin,
      inputValues.cpmPricingBoundsMax
    )
    if (!cpmPricingBoundsMinValidation.isValid)
      newErrors.cpmPricingBoundsMin = cpmPricingBoundsMinValidation.errMsg

    const cpmPricingBoundsMaxValidation = validateCPMMax(
      inputValues.cpmPricingBoundsMin,
      inputValues.cpmPricingBoundsMax
    )
    if (!cpmPricingBoundsMaxValidation.isValid)
      newErrors.cpmPricingBoundsMax = cpmPricingBoundsMaxValidation.errMsg

    const titleValidation = validateTitle(inputValues.title)
    if (!titleValidation.isValid) newErrors.title = titleValidation.errMsg

    setErrors(newErrors)

    return Object.values(newErrors).every((error) => !error)
  }, [
    inputValues.paymentModel,
    inputValues.campaignBudget,
    inputValues.currency,
    inputValues.cpmPricingBoundsMin,
    inputValues.cpmPricingBoundsMax,
    inputValues.title,
    availableBalance,
    balanceToken.decimals
  ])

  const submitForm = useCallback(() => {
    const isValid = validateFields()

    if (isValid) {
      const updatedProps = {
        step: step + 1
      }

      updatePartOfCampaign(updatedProps)
    }
  }, [validateFields, step, updatePartOfCampaign])

  return (
    <>
      <Grid>
        <Grid.Col mb="md">
          <Text color="secondaryText" size="sm" weight="bold" mb="xs">
            1. Campaign Period
          </Text>
          <CampaignPeriod />
        </Grid.Col>
        <Grid.Col mb="md">
          <Text color="secondaryText" size="sm" weight="bold" mb="xs">
            2. Payment Model
          </Text>
          <PaymentModel
            defaultValue={inputValues.paymentModel}
            onChange={handleChange}
            error={errors.paymentModel}
          />
        </Grid.Col>
        <Grid.Col mb="md">
          <Text color="secondaryText" size="sm" weight="bold" mb="xs">
            3. Currency
          </Text>
          <SelectCurrency
            defaultValue={inputValues.currency}
            onChange={handleChange}
            error={errors.currency}
          />
        </Grid.Col>
        <Grid.Col mb="md">
          <Text color="secondaryText" size="sm" weight="bold" mb="xs">
            4. Campaign Budget
          </Text>
          <CampaignBudget
            defaultValue={Number(inputValues.campaignBudget)}
            onChange={handleChange}
            onFocus={() => handleOnFocus('campaignBudget')}
            error={errors.campaignBudget}
          />
        </Grid.Col>
        <Grid.Col mb="md">
          <Group mb="xs" spacing="xs">
            <Text color="secondaryText" size="sm" weight="bold">
              5. CPM
            </Text>
            <Tooltip label="Recommended: Min - 0.10; Max - 0.5" ml="sm">
              <ActionIcon color="secondaryText" size="xs">
                <InfoFilledIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
          <CpmMinMax
            defaultValueMin={Number(inputValues.cpmPricingBoundsMin)}
            defaultValueMax={Number(inputValues.cpmPricingBoundsMax)}
            onChangeMin={handleChange}
            onChangeMax={handleChange}
            errorMin={errors.cpmPricingBoundsMin}
            errorMax={errors.cpmPricingBoundsMax}
            onFocusMin={() => handleOnFocus('cpmPricingBoundsMin')}
            onFocusMax={() => handleOnFocus('cpmPricingBoundsMax')}
          />
        </Grid.Col>
        <Grid.Col mb="md">
          <Text color="secondaryText" size="sm" weight="bold" mb="xs">
            6. Campaign Name
          </Text>
          <CampaignName
            defaultValue={inputValues.title}
            onChange={handleChange}
            onFocus={() => handleOnFocus('title')}
            error={errors.title}
          />
        </Grid.Col>
      </Grid>
      <Button
        type="button"
        onClick={submitForm}
        style={{ display: 'none' }}
        id="createCampaignSubmitBtn1"
      />
    </>
  )
}

export default StepThree
