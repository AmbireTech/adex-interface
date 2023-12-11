import { Devices, SelectData, TargetingInputSingle } from 'types'

export const checkSelectedDevices = (devices: Devices[]) => {
  return devices.length === 1 && devices.includes('mobile')
    ? 'mobile'
    : devices.length === 1 && devices.includes('desktop')
    ? 'desktop'
    : devices.length === 2
    ? 'both'
    : null
}

export const formatCatsAndLocsData = (inputValues: TargetingInputSingle, lib: SelectData[]) => {
  const selectedCats = Object.entries(inputValues).find(
    ([, value]) => Array.isArray(value) && value.length > 0
  )

  if (!selectedCats) return [null, null]
  const [key, values] = selectedCats

  const labels = lib
    .map((item) => (!!values.length && values.includes(item.value) ? item.label : null))
    .filter((x) => !!x)
    .join(', ')

  return [key, labels]
}
