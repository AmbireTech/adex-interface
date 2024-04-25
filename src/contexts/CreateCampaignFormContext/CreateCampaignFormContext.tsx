import { Button } from '@mantine/core'
import { createFormContext } from '@mantine/form'
import { parseBigNumTokenAmountToDecimal } from 'helpers'
import useAccount from 'hooks/useAccount'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { FC, PropsWithChildren, useEffect } from 'react'
import { CampaignUI } from 'types'

const MIN_CAMPAIGN_BUDGET_VALUE = 200
const MIN_CPM_VALUE = 0.1

const [CrCampaignFormProvider, useCreateCampaignFormContext, useCreateCampaignForm] =
  createFormContext<CampaignUI>()

const CreateCampaignFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const { campaign, updateAllCampaign } = useCreateCampaignContext()
  const {
    adexAccount: { availableBalance, balanceToken }
  } = useAccount()

  const validateBudget = (value: string) => {
    const formattedToken = Number(
      parseBigNumTokenAmountToDecimal(availableBalance, balanceToken.decimals)
    )
    return formattedToken < Number(value)
  }

  const validateCPMMin = (formValues: CampaignUI) => {
    const {
      cpmPricingBounds: { min, max }
    } = formValues

    if (Number(min) === 0 || Number.isNaN(Number(min))) {
      return 'Enter CPM min value or a valid number'
    }

    if (Number(min) < MIN_CPM_VALUE) {
      return `CPM min can not be lower than ${MIN_CPM_VALUE}`
    }
    if (min >= max) {
      return 'CPM min can not be greater than CPM max'
    }
    return null
  }

  const validateCPMMax = (formValues: CampaignUI) => {
    const {
      cpmPricingBounds: { min, max }
    } = formValues

    if (Number(max) === 0 || Number.isNaN(Number(max))) {
      return 'Enter CPM max value or a valid number'
    }
    if (Number(max) <= 0) {
      return 'CPM max should be greater than 0'
    }
    if (max <= min) {
      return 'CPM max can not be lower than CPM min'
    }
    return null
  }

  const form = useCreateCampaignForm({
    initialValues: campaign,
    validate: {
      paymentModel: (value: string) => {
        if (value === '') return 'Select payment method'
        return null
      },
      currency: (value: string) => {
        if (value === '') return 'Select currency'
        return null
      },
      campaignBudget: (value: any) => {
        if (value === '' || Number.isNaN(Number(value))) {
          return 'Enter campaign budget or a valid number'
        }

        if (parseFloat(value) < MIN_CAMPAIGN_BUDGET_VALUE) {
          return `Campaign budget can not be lower than ${MIN_CAMPAIGN_BUDGET_VALUE}`
        }

        if (validateBudget(value)) {
          return 'Available balance is lower than the campaign budget'
        }
        return null
      },
      cpmPricingBounds: {
        min: () => {
          return validateCPMMin(form.values)
        },
        max: () => {
          return validateCPMMax(form.values)
        }
      },
      title: (value: string) => {
        if (value === '') {
          return 'Enter Title'
        }
        if (value.length < 2) {
          return 'Campaign name must have at least 2 letters'
        }
        return null
      }
    }
  })

  const handleSubmit = (event: any) => {
    event.preventDefault()
    form.validate()
    if (form.isValid()) updateAllCampaign(form.values as CampaignUI)
    else console.log('the form is not valid')
  }

  useEffect(() => {
    form.setValues(campaign)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign])

  return (
    <CrCampaignFormProvider form={form}>
      <form onSubmit={handleSubmit}>
        {children}
        <Button type="submit" style={{ display: 'none' }} id="createCampaignSubmitBtn" />
      </form>
    </CrCampaignFormProvider>
  )
}

export { CreateCampaignFormProvider, useCreateCampaignFormContext }
