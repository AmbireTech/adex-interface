export const removeOptionalEmptyStringProps = <T>(objToClean: T extends unknown ? any : any): T => {
  const obj = { ...objToClean }
  Object.entries(obj).forEach(([key, value]) => {
    if (value && typeof value === 'object') removeOptionalEmptyStringProps(value)
    if (value === '') {
      delete obj[key]
    }
  })
  return obj
}
export const getEnumKeyByValue = (enumerated: any, value: string) => {
  return Object.keys(enumerated)[Object.values(enumerated).indexOf(value as typeof enumerated)]
}
