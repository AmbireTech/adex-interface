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
