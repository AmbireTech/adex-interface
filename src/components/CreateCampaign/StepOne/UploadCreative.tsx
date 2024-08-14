import { Grid, Text, Code, Stack } from '@mantine/core'
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
    <Stack>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
        3. Upload creatives
      </Text>
      <BannerSizesList adUnits={adUnits} />
      <FilesDropzone onDrop={onDrop} />
      <Text size="xs">
        * uploading html banners requirements: <Code>.zip</Code> fille with index.html inside;
        <Code>index.html</Code> file need to include meta tag in format{' '}
        <Code>{'<meta name="ad.size" content="width=320,height=50">'}</Code>
      </Text>

      {adUnits.length ? (
        <Grid.Col>
          <UploadedBanners />
        </Grid.Col>
      ) : null}
    </Stack>
  )
}

export default UploadCreative
