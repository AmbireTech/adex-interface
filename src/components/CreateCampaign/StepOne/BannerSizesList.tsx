import { Alert, Group, Loader, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import InfoIcon from 'resources/icons/Info'
import CustomAnchor from 'components/common/customAnchor'

const SIZES_COUNT_TO_SHOW = 6

const BannerSizesList = () => {
  const { allowedBannerSizes } = useCreateCampaignContext()

  const popularBannerSizes = useMemo(
    () => allowedBannerSizes.slice(0, SIZES_COUNT_TO_SHOW),
    [allowedBannerSizes]
  )

  const loading = useMemo(() => !popularBannerSizes.length, [popularBannerSizes.length])

  return popularBannerSizes ? (
    <Alert icon={<InfoIcon style={{ marginTop: 0 }} />} color="attention" variant="outline">
      <Group align="center">
        <Text>Recommended banner sizes: {loading ? '' : popularBannerSizes.join(', ')}</Text>
        {loading && <Loader type="dots" />}
        {!loading && (
          <CustomAnchor
            external
            underline="always"
            fw="bold"
            href="https://help.adex.network/hc/en-us/articles/14499102255772-What-are-the-supported-ad-formats"
            c="brand"
          >
            see all
          </CustomAnchor>
        )}
      </Group>
    </Alert>
  ) : null
}

export default BannerSizesList
