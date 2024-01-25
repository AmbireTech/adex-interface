export const validateCreateCampaignFrom = {
  paymentModel: (value: string) => (value === '' ? 'Select payment method' : null),
  currency: (value: string) => (value === '' ? 'Select currency' : null),
  campaignBudget: (value: any) =>
    value === '' || Number.isNaN(Number(value))
      ? 'Enter campaign budget or a valid number'
      : parseFloat(value) <= 0
      ? 'Campaign budget should be greater than 0'
      : null,
  cpmMin: (value: string) =>
    value === '' || Number.isNaN(Number(value))
      ? 'Enter CPM min value or a valid number'
      : parseFloat(value) <= 0
      ? 'CPM min should be greater than 0'
      : null,
  cpmMax: (value: string) =>
    value === '' || Number.isNaN(Number(value))
      ? 'Enter CPM max value or a valid number'
      : parseFloat(value) <= 0
      ? 'CPM max should be greater than 0'
      : null,
  campaignName: (value: string) =>
    value === ''
      ? 'Enter Campaign name'
      : value.length < 2
      ? 'Campaign name must have at least 2 letters'
      : null
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
