import { Checkbox, Grid } from '@mantine/core'
import { Banners, FileWithPath, ShapeVariants } from 'types'
import ImageUrlInput from './ImageUrlInput'

type UploadedBannersProps = {
  uploadedFiles: FileWithPath[] | null
  updateAutoUTMChecked: (isChecked: boolean) => void
  autoUTMChecked: boolean
  imagesInfo: Banners
  handleDeleteCreativeBtnClicked: (file: FileWithPath) => void
}

const UploadedBanners = ({
  uploadedFiles,
  updateAutoUTMChecked,
  autoUTMChecked,
  imagesInfo,
  handleDeleteCreativeBtnClicked
}: UploadedBannersProps) => {
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
      {(Object.keys(imagesInfo) as ShapeVariants[]).map((key: ShapeVariants) => {
        const images = imagesInfo[key]?.fileDetails || []
        if (images.length === 0) return
        const toRemove = key.toString() === 'others'

        return images.map((image) => (
          <Grid.Col key={image.path}>
            <ImageUrlInput
              image={image}
              toRemove={toRemove}
              onDelete={handleDeleteCreativeBtnClicked}
              // TODO: add onChange and store the input
            />
          </Grid.Col>
        ))
      })}
    </Grid>
  )
}

export default UploadedBanners
