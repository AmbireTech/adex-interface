import { Text, Code, Stack, Loader, Flex } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useDropzone from 'hooks/useDropzone'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const {
    campaign: { adUnits }
  } = useCreateCampaignContext()

  const { onDrop, isLoading } = useDropzone()

  return (
    <Stack>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
        3. Upload creatives
      </Text>
      <BannerSizesList />
      <FilesDropzone onDrop={onDrop} />
      <Text size="xs">
        * uploading html banners requirements: <Code>.zip</Code> fille with index.html inside;
        <Code>index.html</Code> file need to include meta tag in format{' '}
        <Code>{'<meta name="ad.size" content="width=320,height=50">'}</Code>
      </Text>
      {adUnits.length ? <UploadedBanners /> : null}
      {isLoading && (
        <Flex justify="center" align="center" h="10vh">
          <Loader size="md" />
        </Flex>
      )}
    </Stack>
  )
}

export default UploadCreative
