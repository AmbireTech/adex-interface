import { parseBigNumTokenAmountToDecimal } from './balances'

export const MIN_CAMPAIGN_BUDGET_VALUE_ADMIN = 20
export const MIN_CAMPAIGN_BUDGET_VALUE = 300
const MIN_CPM_VALUE = 0.1

export const isValidHttpUrl = (inputURL: string) => {
  let url

  try {
    url = new URL(inputURL)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

const validateBudget = (value: bigint, availableBalance: bigint, decimals: number) => {
  const formattedToken = Number(parseBigNumTokenAmountToDecimal(availableBalance, decimals))
  return formattedToken < Number(value)
}

export const validatePaymentModel = (value: string) => {
  if (value === '') return { isValid: false, errMsg: 'Select payment method' }
  return { isValid: true, errMsg: '' }
}

export const validateCurrency = (value: string) => {
  if (value === '') return { isValid: false, errMsg: 'Select currency' }
  return { isValid: true, errMsg: '' }
}

export const validateCampaignBudget = (
  value: bigint,
  availableBalance: bigint,
  decimals: number,
  isAdmin: boolean
) => {
  if (!value || Number(value) === 0 || Number.isNaN(Number(value))) {
    return { isValid: false, errMsg: 'Enter campaign budget or a valid number' }
  }

  const minAmount = isAdmin ? MIN_CAMPAIGN_BUDGET_VALUE_ADMIN : MIN_CAMPAIGN_BUDGET_VALUE

  if (Number(value) < minAmount) {
    return {
      isValid: false,
      errMsg: `Campaign budget can not be lower than ${minAmount}`
    }
  }

  if (validateBudget(value, availableBalance, decimals)) {
    return {
      isValid: false,
      errMsg: 'Available balance is lower than the campaign budget'
    }
  }

  return { isValid: true, errMsg: '' }
}

export const validateCPMMin = (valueMin: string, valueMax: string) => {
  if (Number(valueMin) === 0 || Number.isNaN(Number(valueMin))) {
    return {
      isValid: false,
      errMsg: 'Enter CPM min value or a valid number'
    }
  }

  if (Number(valueMin) < MIN_CPM_VALUE) {
    return {
      isValid: false,
      errMsg: `CPM min can not be lower than ${MIN_CPM_VALUE}`
    }
  }

  if (valueMin >= valueMax) {
    return {
      isValid: false,
      errMsg: 'CPM min can not be greater than CPM max'
    }
  }

  return { isValid: true, errMsg: '' }
}

export const validateCPMMax = (valueMin: string, valueMax: string) => {
  if (Number(valueMax) === 0 || Number.isNaN(Number(valueMax))) {
    return {
      isValid: false,
      errMsg: 'Enter CPM max value or a valid number'
    }
  }
  if (Number(valueMax) <= 0) {
    return {
      isValid: false,
      errMsg: 'CPM max should be greater than 0'
    }
  }
  if (valueMax <= valueMin) {
    return {
      isValid: false,
      errMsg: 'CPM max can not be lower than CPM min'
    }
  }
  return { isValid: true, errMsg: '' }
}

export const validateTitle = (value: string) => {
  if (value === '') {
    return {
      isValid: false,
      errMsg: 'Enter campaign name'
    }
  }
  if (value.length < 2) {
    return {
      isValid: false,
      errMsg: 'Campaign name must have at least 2 letters'
    }
  }
  return { isValid: true, errMsg: '' }
}
