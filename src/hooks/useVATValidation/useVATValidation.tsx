import { useEffect, useState } from 'react'
import { fetchService } from 'services'

const useVATValidation = (country: string, vat: string) => {
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    const validateVAT = async () => {
      try {
        const res = await fetchService({
          url: `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${country}/vat/${vat}`
        })

        const result = await res.json()
        setIsValid(true)
        console.log('result', result)
      } catch (e) {
        console.error(e)
        setIsValid(false)
      }
    }

    validateVAT()
  }, [country, vat])
  return { isValid }
}

export default useVATValidation
