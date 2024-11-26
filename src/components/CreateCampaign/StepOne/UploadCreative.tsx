import { Text, Code, Stack } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import UploadedBanners from './UploadedBanners'
import BannerSizesList from './BannerSizesList'
import FilesDropzone from './FilesDropzone'

const UploadCreative = () => {
  const { allowedBannerSizes } = useCreateCampaignContext()

  const loading = useMemo(() => !allowedBannerSizes.length, [allowedBannerSizes.length])

  return (
    <Stack>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
        3. Upload creatives
      </Text>
      <BannerSizesList />
      <FilesDropzone loading={loading} />
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
