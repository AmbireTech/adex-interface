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

  const selectedBannerSizes = useMemo(() => {
    if (selectedDevices === 'mobile') return mobileSizes
    if (selectedDevices === 'desktop') return desktopSizes
    if (selectedDevices === 'both') return updatedBannerSizes
    return null
  }, [selectedDevices, mobileSizes, desktopSizes, updatedBannerSizes])

  const generateBanners = (sizes: any[]) => (
    <Grid>
      {sizes.map((item) => (
        <Grid.Col span="content" key={`${item.bannerSizes.w}x${item.bannerSizes.h}`}>
          <BannerSizeMock variant={item} />
        </Grid.Col>
      ))}
    </Grid>
  )

  return selectedBannerSizes ? generateBanners(selectedBannerSizes) : null
}

export default BannerSizesList
