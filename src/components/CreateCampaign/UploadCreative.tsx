import { Grid, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useState } from 'react'
import { BANNER_VARIANTS } from 'constants/banners'
import { Banners, FileWithPath } from 'types'
import useDropzone from 'hooks/useDropzone'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { device }
  } = useCreateCampaignContext()

  const [autoUTMChecked, setAutoUTMChecked] = useState(false)
  const updateAutoUTMChecked = useCallback((isChecked: boolean) => setAutoUTMChecked(isChecked), [])

  const [imagesInfo, setImagesInfo] = useState<Banners>({
    mediumRectangle: { details: BANNER_VARIANTS.mediumRectangle, fileDetails: [] },
    skyscraper: { details: BANNER_VARIANTS.skyscraper, fileDetails: [] },
    leaderboard: { details: BANNER_VARIANTS.leaderboard, fileDetails: [] },
    billboard: { details: BANNER_VARIANTS.billboard, fileDetails: [] },
    halfPage: { details: BANNER_VARIANTS.halfPage, fileDetails: [] },
    mobileBanner: { details: BANNER_VARIANTS.mobileBanner, fileDetails: [] },
    mobileLeaderboard: { details: BANNER_VARIANTS.mobileLeaderboard, fileDetails: [] },
    others: { fileDetails: [] }
  })

  const updateBanners = useCallback(
    (updatedValues: Banners) => setImagesInfo((prev) => ({ ...prev, ...updatedValues })),
    []
  )

  const { onDrop, updateUploadedFiles, uploadedFiles } = useDropzone({ updateBanners })

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: FileWithPath) => {
      if (!uploadedFiles) return
      updateUploadedFiles(uploadedFiles.filter((item) => item.name !== file.name))
    },
    [uploadedFiles, updateUploadedFiles]
  )

  return (
    <Grid>
      <Grid.Col>
        {device && (
          <>
            <Text color="secondaryText" size="sm" weight="bold" mb="xs">
              2. Upload creatives
            </Text>
            <Text color="secondaryText" size="xs" weight="bold" mb="xs">
              Accepted banner sizes
            </Text>
            <BannerSizesList imagesInfo={imagesInfo} />
            <FilesDropzone onDrop={onDrop} />
          </>
        )}
      </Grid.Col>
      <Grid.Col>
        <UploadedBanners
          autoUTMChecked={autoUTMChecked}
          uploadedFiles={uploadedFiles}
          updateAutoUTMChecked={updateAutoUTMChecked}
          imagesInfo={imagesInfo}
          handleDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked}
        />
      </Grid.Col>
    </Grid>
  )
}

export default UploadCreative
