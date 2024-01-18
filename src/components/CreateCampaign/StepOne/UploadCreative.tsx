import { Grid, Text } from '@mantine/core'
import { useCallback, useState } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { removeAdUnitFromBanners } from 'helpers/createCampaignHelpers'
import useDropzone from 'hooks/useDropzone'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { creativesDetails: imagesInfo },
    updateCampaignAdUnits
  } = useCreateCampaignContext()

  const [autoUTMChecked, setAutoUTMChecked] = useState(false)
  const updateAutoUTMChecked = useCallback((isChecked: boolean) => setAutoUTMChecked(isChecked), [])

  const { onDrop } = useDropzone({
    defaultBannersValue: imagesInfo
  })
  // TODO: add useMemo
  const hasUploadedCreatives =
    Object.entries(imagesInfo).filter(([, value]) => {
      console.log('value', value)
      return value?.adUnits && value.adUnits.length > 0
    }).length > 0

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: AdUnit) => {
      const updated = removeAdUnitFromBanners(file, imagesInfo)
      updateCampaignAdUnits(updated)
    },
    [imagesInfo, updateCampaignAdUnits]
  )

  const handleOnInputChange = useCallback((inputText: string, file: AdUnit) => {
    console.log('inputText, file', inputText, file)
  }, [])

  return (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          2. Upload creatives
        </Text>
        <Text color="secondaryText" size="xs" weight="bold" mb="xs">
          Accepted banner sizes
        </Text>
        <BannerSizesList imagesInfo={imagesInfo} />
        <FilesDropzone onDrop={onDrop} />
      </Grid.Col>

      {hasUploadedCreatives ? (
        <Grid.Col>
          <UploadedBanners
            autoUTMChecked={autoUTMChecked}
            updateAutoUTMChecked={updateAutoUTMChecked}
            imagesInfo={imagesInfo}
            onDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked}
            handleOnInputChange={handleOnInputChange}
          />
        </Grid.Col>
      ) : null}
    </Grid>
  )
}

export default UploadCreative
