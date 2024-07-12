import { Alert, Flex, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { checkBannerSizes } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import { SupplyStatsDetails } from 'types'
import InfoIcon from 'resources/icons/Info'
import CustomAnchor from 'components/common/customAnchor'

const SIZES_COUNT_TO_SHOW = 6

const useStyles = createStyles((theme) => ({
  brandTextColor: {
    color: theme.colors.brand[3]
  }
}))

const getPopularBannerSizes = (bannerSizes: SupplyStatsDetails[] | SupplyStatsDetails[][]) => {
  let result: SupplyStatsDetails[][] | SupplyStatsDetails[] = []

  if (bannerSizes.length && Array.isArray(bannerSizes[0])) {
    result = (bannerSizes as SupplyStatsDetails[][])
      .map((item: SupplyStatsDetails[]) => item.slice(0, SIZES_COUNT_TO_SHOW))
      .flat()
  } else {
    result = (bannerSizes as SupplyStatsDetails[]).slice(0, SIZES_COUNT_TO_SHOW)
  }

  return result.sort((a, b) => b.count - a.count)
}

const BannerSizesList = ({ adUnits }: { adUnits: AdUnit[] }) => {
  const { selectedBannerSizes } = useCreateCampaignContext()
  const { classes } = useStyles()

  const popularBannerSizes = useMemo(
    () =>
      selectedBannerSizes && selectedBannerSizes.length
        ? getPopularBannerSizes(selectedBannerSizes)
        : [],
    [selectedBannerSizes]
  )

  const updatedBannerSizes = useMemo(
    () =>
      popularBannerSizes && popularBannerSizes.length
        ? checkBannerSizes(popularBannerSizes, adUnits)
        : [],
    [adUnits, popularBannerSizes]
  )

  return updatedBannerSizes ? (
    <Alert icon={<InfoIcon style={{ marginTop: 0 }} />} color="attention" variant="outline">
      <Flex justify="space-between">
        <Text>
          Recommended banner sizes: {updatedBannerSizes.map((size) => size.value).join(', ')}
        </Text>
        <CustomAnchor
          external
          underline="always"
          fw="bold"
          href="https://help.adex.network/hc/en-us/articles/14499102255772-What-are-the-supported-ad-formats"
          className={classes.brandTextColor}
        >
          see all
        </CustomAnchor>
      </Flex>
    </Alert>
  ) : null
}

export default BannerSizesList
