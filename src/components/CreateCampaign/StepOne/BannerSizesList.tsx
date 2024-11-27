import { Alert, Loader, Group, Spoiler } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import InfoIcon from 'resources/icons/Info'

const BannerSizesList = () => {
  const { allowedBannerSizes } = useCreateCampaignContext()

  const loading = useMemo(() => !allowedBannerSizes.length, [allowedBannerSizes.length])

  return (
    <Alert
      icon={<InfoIcon />}
      color="attention"
      variant="outline"
      title="Recommended banner sizes:"
    >
      <Spoiler maxHeight={25} showLabel={loading ? '' : 'Show more'} hideLabel="Show less">
        <Group>{loading ? <Loader type="dots" /> : allowedBannerSizes.join(', ')}</Group>
      </Spoiler>
    </Alert>
  )
}

export default BannerSizesList
