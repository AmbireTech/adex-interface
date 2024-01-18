import { useMemo } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import { Banners, ShapeVariants } from 'types'
import { AdUnit } from 'adex-common/dist/types'
import ImageUrlInput from './ImageUrlInput'

type UploadedBannersProps = {
  updateAutoUTMChecked: (isChecked: boolean) => void
  autoUTMChecked: boolean
  imagesInfo: Banners
  onDeleteCreativeBtnClicked: (file: AdUnit) => void
  handleOnInputChange: (inputText: string, file: AdUnit) => void
}

const UploadedBanners = ({
  // uploadedFiles,
  updateAutoUTMChecked,
  autoUTMChecked,
  imagesInfo,
  onDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const inputBanners = useMemo(
    () =>
      (Object.keys(imagesInfo) as ShapeVariants[]).map((key: ShapeVariants) => {
        const images = imagesInfo[key]?.adUnits || []
        const toRemove = key.toString() === 'others'

        return images.length > 0
          ? images.map((image) => (
              <Grid.Col key={image.id}>
                <ImageUrlInput
                  image={image}
                  toRemove={toRemove}
                  onDelete={onDeleteCreativeBtnClicked}
                  onChange={(e) => handleOnInputChange(e.target.value, image)}
                />
              </Grid.Col>
            ))
          : null
      }),
    [onDeleteCreativeBtnClicked, imagesInfo, handleOnInputChange]
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

      {inputBanners}
    </Grid>
  )
}

export default UploadedBanners
