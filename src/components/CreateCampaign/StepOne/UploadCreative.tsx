import { Grid, Text } from '@mantine/core'
import { useCallback } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnits },
    removeAdUnit
  } = useCreateCampaignContext()

  const { onDrop } = useDropzone()

  const handleDeleteCreativeBtnClicked = useCallback(
    (file: AdUnit) => {
      removeAdUnit(file.id)
    },
    [removeAdUnit]
  )

  return (
    <Grid>
      <Grid.Col>
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          3. Upload creatives
        </Text>
        <BannerSizesList adUnits={adUnits} />
        <FilesDropzone onDrop={onDrop} />
      </Grid.Col>

      {adUnits.length ? (
        <Grid.Col>
          <UploadedBanners onDeleteCreativeBtnClicked={handleDeleteCreativeBtnClicked} />
        </Grid.Col>
      ) : null}
    </Grid>
  )
}

export default UploadCreative
