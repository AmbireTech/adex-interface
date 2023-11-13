import { useMemo } from 'react'
import { Checkbox, Grid } from '@mantine/core'
import { Banners, FileWithPath, ShapeVariants } from 'types'
import ImageUrlInput from './ImageUrlInput'

type UploadedBannersProps = {
  uploadedFiles: FileWithPath[] | null
  updateAutoUTMChecked: (isChecked: boolean) => void
  autoUTMChecked: boolean
  imagesInfo: Banners
  handleDeleteCreativeBtnClicked: (file: FileWithPath) => void
  handleOnInputChange: (inputText: string, file: FileWithPath) => void
}

const UploadedBanners = ({
  uploadedFiles,
  updateAutoUTMChecked,
  autoUTMChecked,
  imagesInfo,
  handleDeleteCreativeBtnClicked,
  handleOnInputChange
}: UploadedBannersProps) => {
  const inputBanners = useMemo(
    () =>
      (Object.keys(imagesInfo) as ShapeVariants[]).map((key: ShapeVariants) => {
        const images = imagesInfo[key]?.fileDetails || []
        if (images.length === 0) return
        const toRemove = key.toString() === 'others'

        return images.map((image) => (
          <Grid.Col key={image.path}>
            <ImageUrlInput
              image={image}
              toRemove={toRemove}
              onDelete={handleDeleteCreativeBtnClicked}
              onChange={(e) => handleOnInputChange(e.target.value, image)}
            />
          </Grid.Col>
        ))
      }),
    [handleDeleteCreativeBtnClicked, imagesInfo, handleOnInputChange]
  )

  return (
    <Grid>
      {uploadedFiles && uploadedFiles.length > 0 && (
        <Grid.Col>
          <Checkbox
            checked={autoUTMChecked}
            label="Auto UTM tracking"
            onChange={(event) => updateAutoUTMChecked(event.currentTarget.checked)}
          />
        </Grid.Col>
      )}
      {inputBanners}
    </Grid>
  )
}

export default UploadedBanners
