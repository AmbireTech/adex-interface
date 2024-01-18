import { AdUnit, TargetingInputApplyProp, TargetingInputSingle } from 'adex-common/dist/types'
import { DEFAULT_CATS_LOCS_VALUE } from 'constants/createCampaign'
import { Banners, Devices, SelectData } from 'types'

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

export const removeAdUnitFromBanners = (adUnitToRemove: AdUnit, banners: Banners): Banners => {
  const updatedBanners: Banners = { ...banners }

  Object.keys(updatedBanners).forEach((bannerKey) => {
    const banner = updatedBanners[bannerKey]

    if (banner && banner.adUnits) {
      banner.adUnits = banner.adUnits.filter((adUnit) => adUnit.id !== adUnitToRemove.id)
    }
  })

  return updatedBanners
}
