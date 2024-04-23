import { useCallback, useMemo } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import { ALLOWED_BANNER_SIZES } from 'constants/banners'
import { UploadedBannersProps } from 'types'
import ImageUrlInput from './ImageUrlInput'

const UploadedBanners = ({
  updateAutoUTMChecked,
  autoUTMChecked,
  onDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const {
    campaign: { adUnits, devices }
  } = useCreateCampaignContext()

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

  return (
    <Grid>
      <Grid.Col>
        <Checkbox
          checked={autoUTMChecked}
          label="Auto UTM tracking"
          onChange={(event) => updateAutoUTMChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
      {adUnits.length > 0 &&
        adUnits.map((image: AdUnit) => {
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
