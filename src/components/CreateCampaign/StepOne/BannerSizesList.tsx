import { Grid } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import { checkBannerSizes, checkSelectedDevices } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { AdUnit, Placement } from 'adex-common/dist/types'
import { BannerFormats, BannerSizesPopularCount, Devices } from 'types'

const selectBannerSizes = (
  bannerSizeType: Placement | Devices | 'both' | null | undefined,
  sizes: BannerFormats
): BannerSizesPopularCount[] => {
  switch (bannerSizeType) {
    case 'app':
      return sizes.appBannerFormats
    case 'mobile':
      return sizes.siteBannerFormatsMobile
    case 'desktop':
      return sizes.siteBannerFormatsDesktop
    case 'both':
      return [...sizes.siteBannerFormatsMobile, ...sizes.siteBannerFormatsDesktop]
    default:
      return []
  }
}

const BannerSizesList = ({ adUnits }: { adUnits: AdUnit[] }) => {
  const {
    campaign: {
      devices,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    bannerSizes
  } = useCreateCampaignContext()

  const updatedBannerSizes = useMemo(() => {
    const selectedPlatform = placement === 'app' ? placement : checkSelectedDevices(devices)

    const selectedBannerSizes = selectBannerSizes(selectedPlatform, bannerSizes)
    return selectedBannerSizes && selectedBannerSizes.length
      ? checkBannerSizes(selectedBannerSizes, adUnits).sort((a, b) => b.count - a.count)
      : []
  }, [adUnits, devices, placement, bannerSizes])

  const generateBanners = (sizes: BannerSizesPopularCount[]) => (
    <Grid>
      {sizes.map((item) => (
        <Grid.Col span="content" key={`${item.value}+${item.count}`}>
          <BannerSizeMock variant={item.value} active={!!item.checked} />
        </Grid.Col>
      ))}
    </Grid>
  )

  return updatedBannerSizes ? generateBanners(updatedBannerSizes) : null
}

export default BannerSizesList
