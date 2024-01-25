import { AdUnit, TargetingInputApplyProp, TargetingInputSingle } from 'adex-common/dist/types'
import { BANNER_SIZES } from 'constants/banners'
import { DEFAULT_CATS_LOCS_VALUE } from 'constants/createCampaign'
import { Devices, SelectData } from 'types'

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

  if (inputValues.apply === 'all' && typeof selectedCats === 'undefined') return ['all', null]

  if (!selectedCats) return [null, null]
  const [key, values] = selectedCats

  const labels = lib
    .map((item) => (!!values.length && values.includes(item.value) ? item.label : null))
    .filter((x) => !!x)
    .join(', ')

  return [key, labels]
}

export const updateCatsLocsObject = (selectedRadio: TargetingInputApplyProp, values: string[]) => {
  // const updated = { ...DEFAULT_CATS_LOCS_VALUE }
  const updated = structuredClone(DEFAULT_CATS_LOCS_VALUE)
  if (selectedRadio !== 'all') {
    updated[selectedRadio] = values
    updated.apply = selectedRadio
  }
  return updated
}

export const findArrayWithLengthInObjectAsValue = (obj: object) =>
  Object.entries(obj).find(([, value]) => Array.isArray(value) && value.length > 0)

export const checkBannerSizes = (adUnits: AdUnit[]) =>
  BANNER_SIZES.map((item) => {
    const copy = { ...item }
    adUnits.forEach((adUnit) => {
      if (
        adUnit.banner?.format.w === item.bannerSizes.w &&
        adUnit.banner?.format.h === item.bannerSizes.h
      )
        copy.checked = true
    })

    return copy
  })
