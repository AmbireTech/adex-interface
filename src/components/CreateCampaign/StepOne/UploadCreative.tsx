import { Text, Code, Stack } from '@mantine/core'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  return (
    <Stack>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
        3. Upload creatives
      </Text>
      <BannerSizesList />
      <FilesDropzone />
      <Text size="xs">
        * uploading html banners requirements: <Code>.zip</Code> fille with index.html inside;
        <Code>index.html</Code> file need to include meta tag in format{' '}
        <Code>{'<meta name="ad.size" content="width=320,height=50">'}</Code>
      </Text>
      <UploadedBanners />
    </Stack>
  )
}

export default UploadCreative
