export const validateCreateCampaignFrom = {
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
    if (parseFloat(value) <= 0) {
      return 'Campaign budget should be greater than 0'
    }
    return null
  },
  'pricingBounds.IMPRESSION.min': (value: string) => {
    if (value === '' || Number.isNaN(Number(value))) {
      return 'Enter CPM min value or a valid number'
    }
    if (parseFloat(value) <= 0) {
      return 'CPM min should be greater than 0'
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
  campaignName: (value: string) => {
    if (value === '') {
      return 'Enter Campaign name'
    }
    if (value.length < 2) {
      return 'Campaign name must have at least 2 letters'
    }
    return null
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
