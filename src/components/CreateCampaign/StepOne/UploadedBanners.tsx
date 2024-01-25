import { Checkbox, Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import { ALLOWED_BANNER_SIZES } from 'constants/banners'
import ImageUrlInput from './ImageUrlInput'

type UploadedBannersProps = {
  updateAutoUTMChecked: (isChecked: boolean) => void
  autoUTMChecked: boolean
  onDeleteCreativeBtnClicked: (file: AdUnit) => void
  handleOnInputChange: (inputText: string, fileId: string) => void
}

const UploadedBanners = ({
  updateAutoUTMChecked,
  autoUTMChecked,
  onDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const {
    campaign: { adUnits, devices }
  } = useCreateCampaignContext()

  const inputBanners =
    adUnits.length > 0
      ? adUnits.map((image: AdUnit) => {
          const allowedSizes =
            devices.length > 0 && devices.length > 1
              ? [...ALLOWED_BANNER_SIZES.desktop.flat(), ...ALLOWED_BANNER_SIZES.mobile.flat()]
              : ALLOWED_BANNER_SIZES[devices[0]]

          const isMatchedTheSizes = allowedSizes.find(
            (item) => item.w === image.banner?.format.w && item.h === image.banner?.format.h
          )

          return (
            <Grid.Col key={image.id}>
              <ImageUrlInput
                image={image}
                toRemove={!isMatchedTheSizes}
                onDelete={onDeleteCreativeBtnClicked}
                onChange={(e) => handleOnInputChange(e.target.value, image.id)}
              />
            </Grid.Col>
          )
        })
      : null

  return (
    <Grid>
      <Grid.Col>
        <Checkbox
          checked={autoUTMChecked}
          label="Auto UTM tracking"
          onChange={(event) => updateAutoUTMChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
      {inputBanners}
    </Grid>
  )
}

export default UploadedBanners
