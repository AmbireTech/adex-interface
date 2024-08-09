import { Grid, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnits }
  } = useCreateCampaignContext()

  const { onDrop } = useDropzone()

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
          <UploadedBanners />
        </Grid.Col>
      ) : null}
    </Grid>
  )
}

export default UploadCreative
