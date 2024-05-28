import { useCallback, useMemo } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import { UploadedBannersProps } from 'types'
import { checkSelectedDevices, selectBannerSizes } from 'helpers/createCampaignHelpers'
import ImageUrlInput from './ImageUrlInput'

const UploadedBanners = ({
  updateAutoUTMChecked,
  autoUTMChecked,
  onDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const {
    campaign: {
      adUnits,
      devices,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    supplyStats
  } = useCreateCampaignContext()

  const allowedSizes = useMemo(() => {
    const selectedPlatform = placement === 'app' ? placement : checkSelectedDevices(devices)
    const selectedBannerSizes = selectBannerSizes(selectedPlatform, supplyStats).map(
      (item) => item.value
    )

    return selectedBannerSizes
  }, [supplyStats, placement, devices])

  const isMatchedTheSizes = useCallback(
    (img: AdUnit) =>
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
