import { useCallback, useMemo } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnitExtended, UploadedBannersProps } from 'types'
import ImageUrlInput from './ImageUrlInput'

const UploadedBanners = ({
  updateAutoUTMChecked,
  autoUTMChecked,
  onDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const {
    campaign: { adUnitsExtended },
    selectedBannerSizes
  } = useCreateCampaignContext()

  const allowedSizes = useMemo(
    () => selectedBannerSizes.flat().map((item) => item.value),
    [selectedBannerSizes]
  )

  const isMatchedTheSizes = useCallback(
    (img: AdUnitExtended) =>
      allowedSizes &&
      allowedSizes.length > 0 &&
      allowedSizes.includes(`${img.banner?.format.w}x${img.banner?.format.h}`),
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
