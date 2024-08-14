import { AllCountries, Alpha3Code } from 'adex-common'

export const CountryData: Map<string, { name: string }> = (() => {
  const data: Map<Alpha3Code, { name: string }> = new Map()
  Object.values(AllCountries).forEach(({ code, name }) => {
    data.set(code, { name })
  })

  return data
})()

export const CountryNames: Array<string> = (() => {
  return AllCountries.map(({ name }) => name)
})()
