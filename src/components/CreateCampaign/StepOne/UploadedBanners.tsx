import { useCallback } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import ImageUrlInput from './ImageUrlInput'
import { UtmInfo } from '../CreateCampaignCommon'

const UploadedBanners = () => {
  const {
    campaign: {
      adUnits,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    allowedBannerSizes,
    form,
    removeAdUnit,
    getInputProps,
    key
  } = useCreateCampaignContext()

  const isMatchedTheSizes = useCallback(
    (img: AdUnit) => {
      const size = `${img.banner?.format.w}x${img.banner?.format.h}`
      return allowedBannerSizes.includes(size)
    },
    [allowedBannerSizes]
  )

  return (
    <Grid>
      <Grid.Col>
        <Checkbox
          label={<UtmInfo title="Auto UTM tracking *" placement={placement} />}
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
