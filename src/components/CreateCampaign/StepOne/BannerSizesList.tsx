import { Grid } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import { checkBannerSizes } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import { SupplyStatsDetails } from 'types'

const getPopularBannerSizes = (bannerSizes: SupplyStatsDetails[] | SupplyStatsDetails[][]) => {
  let result: SupplyStatsDetails[][] | SupplyStatsDetails[] = []

  if (bannerSizes.length && Array.isArray(bannerSizes[0])) {
    result = (bannerSizes as SupplyStatsDetails[][])
      .map((item: SupplyStatsDetails[]) => item.slice(0, 10))
      .flat()
  } else {
    result = (bannerSizes as SupplyStatsDetails[]).slice(0, 10)
  }

  return result.sort((a, b) => b.count - a.count)
}

const BannerSizesList = ({ adUnits }: { adUnits: AdUnit[] }) => {
  const { selectedBannerSizes } = useCreateCampaignContext()
  const { uniqueSizesWithCount } = useCreateCampaignData()

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
    <Grid columns={10}>
      {updatedBannerSizes.map((item) => {
        const addedBannerCount = uniqueSizesWithCount.find(
          ({ value }) => item.value === value
        )?.count

        return (
          <Grid.Col xs={2} sm={2} md={2} lg={2} xl={1} key={`${item.value}+${item.count}`}>
            <BannerSizeMock
              variant={item.value}
              active={!!item.checked}
              addedBannerCount={addedBannerCount}
            />
          </Grid.Col>
        )
      })}
    </Grid>
  ) : null
}

export default BannerSizesList
