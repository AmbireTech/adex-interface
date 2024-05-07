import { useCallback, useMemo, useRef } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import { ALLOWED_BANNER_SIZES } from 'constants/banners'
import { AdUnitExtended, UploadedBannersProps } from 'types'
import ImageUrlInput from './ImageUrlInput'

const UploadedBanners = ({
  updateAutoUTMChecked,
  autoUTMChecked,
  onDeleteCreativeBtnClicked
}: // handleOnInputChange
UploadedBannersProps) => {
  const {
    campaign: { adUnitsExtended, devices },
    updateCampaign
  } = useCreateCampaignContext()
  console.log('adUnitsExtended', adUnitsExtended)

  const allowedSizes = useMemo(
    () =>
      devices.length > 0 && devices.length > 1
        ? [...ALLOWED_BANNER_SIZES.desktop.flat(), ...ALLOWED_BANNER_SIZES.mobile.flat()]
        : ALLOWED_BANNER_SIZES[devices[0]],
    [devices]
  )

  const isMatchedTheSizes = useCallback(
    (img: AdUnit) =>
      allowedSizes &&
      allowedSizes.length > 0 &&
      allowedSizes.find(
        (item) => item.w === img.banner?.format.w && item.h === img.banner?.format.h
      ),
    [allowedSizes]
  )

  const debounceTimer = useRef<NodeJS.Timeout>()
  const handleOnInputChange = useCallback(
    (inputText: string, adUnitId: string) => {
      // const isValid = isValidHttpUrl(inputText)
      // if (!isValid) return

      if (debounceTimer.current) clearTimeout(debounceTimer.current)

      debounceTimer.current = setTimeout(() => {
        const updated = [...adUnitsExtended]
        updated.forEach((element) => {
          const elCopy = { ...element }
          if (elCopy.id === adUnitId) elCopy.banner!.targetUrl = inputText
          return elCopy
        })
        updateCampaign('adUnitsExtended', updated)
      }, 300)
    },
    [updateCampaign, adUnitsExtended]
  )

  return (
    <Grid>
      <Grid.Col>
        <Checkbox
          checked={autoUTMChecked}
          label="Auto UTM tracking"
          onChange={(event) => updateAutoUTMChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
      {adUnitsExtended.length > 0 &&
        adUnitsExtended.map((image: AdUnitExtended) => {
          return (
            <Grid.Col key={image.id}>
              <ImageUrlInput
                image={image}
                toRemove={!isMatchedTheSizes(image)}
                onDelete={onDeleteCreativeBtnClicked}
                onChange={(e) => handleOnInputChange(e.target.value, image.id)}
              />
            </Grid.Col>
          )
        })}
    </Grid>
  )
}

export default UploadedBanners
