import { Grid } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import { checkBannerSizes, checkSelectedDevices } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { AdUnit } from 'adex-common/dist/types'

const BannerSizesList = ({ adUnits }: { adUnits: AdUnit[] }) => {
  const {
    campaign: { devices }
  } = useCreateCampaignContext()
  const selectedDevices = useMemo(() => checkSelectedDevices(devices), [devices])
  const updatedBannerSizes = useMemo(() => checkBannerSizes(adUnits), [adUnits])

  const mobileSizes = useMemo(
    () => updatedBannerSizes.filter((item) => item.device === 'mobile'),
    [updatedBannerSizes]
  )
  const desktopSizes = useMemo(
    () => updatedBannerSizes.filter((item) => item.device === 'desktop'),
    [updatedBannerSizes]
  )

  return selectedDevices === 'mobile' ? (
    <Grid>
      {mobileSizes.map((item) => (
        <Grid.Col span="content" key={`${item.bannerSizes.w}x${item.bannerSizes.h}`}>
          <BannerSizeMock variant={item} />
        </Grid.Col>
      ))}
    </Grid>
  ) : selectedDevices === 'desktop' ? (
    <Grid>
      {desktopSizes.map((item) => (
        <Grid.Col span="content" key={`${item.bannerSizes.w}x${item.bannerSizes.h}`}>
          <BannerSizeMock variant={item} />
        </Grid.Col>
      ))}
    </Grid>
  ) : selectedDevices === 'both' ? (
    <Grid>
      {updatedBannerSizes.map((item) => (
        <Grid.Col span="content" key={`${item.bannerSizes.w}x${item.bannerSizes.h}`}>
          <BannerSizeMock variant={item} />
        </Grid.Col>
      ))}
    </Grid>
  ) : null
}

export default BannerSizesList
