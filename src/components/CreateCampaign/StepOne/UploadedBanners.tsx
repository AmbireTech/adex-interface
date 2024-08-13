import { useCallback, useMemo } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import ImageUrlInput from './ImageUrlInput'

const UploadedBanners = () => {
  const {
    campaign: { adUnits },
    selectedBannerSizes,
    form,
    removeAdUnit,
    getInputProps,
    key
  } = useCreateCampaignContext()

  const allowedSizes = useMemo(
    () => selectedBannerSizes.flat().map((item) => item.value),
    [selectedBannerSizes]
  )

  const isMatchedTheSizes = useCallback(
    (img: AdUnit) => {
      if (!allowedSizes || allowedSizes.length === 0) {
        return true
      }

      const size = `${img.banner?.format.w}x${img.banner?.format.h}`
      return allowedSizes.includes(size)
    },
    [allowedSizes]
  )

  return (
    <Grid>
      <Grid.Col>
        <Checkbox
          label="Auto UTM tracking"
          key={key('autoUTMChecked')}
          {...getInputProps('autoUTMChecked', { type: 'checkbox' })}
        />
      </Grid.Col>
      {adUnits.length > 0 &&
        adUnits.map((image: AdUnit, index: number) => {
          return (
            <Grid.Col key={image.id}>
              <ImageUrlInput
                image={image}
                toRemove={!isMatchedTheSizes(image)}
                onDelete={removeAdUnit}
                index={index}
                form={form}
              />
            </Grid.Col>
          )
        })}
    </Grid>
  )
}

export default UploadedBanners
