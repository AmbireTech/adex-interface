import { useCallback } from 'react'
import { fetchService } from 'services'

export enum CountryCodes {
  Austria = 'AT',
  Belgium = 'BE',
  Bulgaria = 'BG',
  Croatia = 'HR',
  Cyprus = 'CY',
  CzechRepublic = 'CZ',
  Denmark = 'DK',
  Estonia = 'EE',
  Finland = 'FI',
  France = 'FR',
  Germany = 'DE',
  Greece = 'EL',
  Hungary = 'HU',
  Ireland = 'IE',
  Italy = 'IT',
  Latvia = 'LV',
  Lithuania = 'LT',
  Luxembourg = 'LU',
  Malta = 'MT',
  Netherlands = 'NL',
  Poland = 'PL',
  Portugal = 'PT',
  Romania = 'RO',
  Slovakia = 'SK',
  Slovenia = 'SI',
  Spain = 'ES',
  Sweden = 'SE',
  NorthernIreland = 'XI'
}

const useVATValidation = () => {
  const validateVAT = useCallback(async (country: keyof typeof CountryCodes, vat: string) => {
    if (!country || !vat) return { isValid: false, error: 'Invalid input' }
    const countryCode = CountryCodes[country]
    let isValid = false
    let error = null

    try {
      const response = await fetchService({
        url: `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${vat}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error('Invalid response from VAT validation API')
      }

      isValid = result.valid
    } catch (e: any) {
      console.error(e.message || e)
      error = e.message || e
    }

    return { isValid, error }
  }, [])

  return { validateVAT }
}

export default useVATValidation
