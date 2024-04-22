import { Token } from 'types'
import { parseBigNumTokenAmountToDecimal } from './balances'

const MIN_CAMPAIGN_BUDGET_VALUE = 500
const MIN_CPM_VALUE = 0.1

export const validateCreateCampaignFrom = (availableBalance: bigint, balanceToken: Token) => {
  const validateBudget = (value: string) => {
    const formattedToken = Number(
      parseBigNumTokenAmountToDecimal(availableBalance, balanceToken.decimals)
    )
    return formattedToken < Number(value)
  }

  return {
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
      if (parseFloat(value) <= MIN_CAMPAIGN_BUDGET_VALUE) {
        return `Campaign budget should be greater than ${MIN_CAMPAIGN_BUDGET_VALUE}`
      }

      if (validateBudget(value)) {
        return 'Available balance is lower than the campaign budget'
      }
      return null
    },
    'pricingBounds.IMPRESSION.min': (value: string) => {
      if (value === '' || Number.isNaN(Number(value))) {
        return 'Enter CPM min value or a valid number'
      }
      if (parseFloat(value) <= MIN_CPM_VALUE) {
        return `CPM min should be greater than ${MIN_CPM_VALUE}`
      }
      return null
    },
    'pricingBounds.IMPRESSION.max': (value: string) => {
      if (value === '' || Number.isNaN(Number(value))) {
        return 'Enter CPM max value or a valid number'
      }
      if (parseFloat(value) <= 0) {
        return 'CPM max should be greater than 0'
      }
      return null
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
}

export const isValidHttpUrl = (inputURL: string) => {
  let url

  try {
    url = new URL(inputURL)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}
