import { Alert } from '@mantine/core'
// import BannerSizeMock from 'components/common/BannerSizeMock'
import { checkBannerSizes } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { AdUnit } from 'adex-common/dist/types'
// import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import { SupplyStatsDetails } from 'types'
import InfoIcon from 'resources/icons/Info'

const getPopularBannerSizes = (bannerSizes: SupplyStatsDetails[] | SupplyStatsDetails[][]) => {
  let result: SupplyStatsDetails[][] | SupplyStatsDetails[] = []

  if (bannerSizes.length && Array.isArray(bannerSizes[0])) {
    result = (bannerSizes as SupplyStatsDetails[][])
      .map((item: SupplyStatsDetails[]) => item.slice(0, 6))
      .flat()
  } else {
    result = (bannerSizes as SupplyStatsDetails[]).slice(0, 6)
  }

  return result.sort((a, b) => b.count - a.count)
}

const BannerSizesList = ({ adUnits }: { adUnits: AdUnit[] }) => {
  const { selectedBannerSizes } = useCreateCampaignContext()
  // const { uniqueSizesWithCount } = useCreateCampaignData()

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
    // <Grid columns={10}>
    //   {updatedBannerSizes.map((item) => {
    //     const addedBannerCount = uniqueSizesWithCount.find(
    //       ({ value }) => item.value === value
    //     )?.count

    //     return (
    //       <Grid.Col xs={2} sm={2} md={2} lg={2} xl={1} key={`${item.value}+${item.count}`}>
    //         <BannerSizeMock
    //           variant={item.value}
    //           active={!!item.checked}
    //           addedBannerCount={addedBannerCount}
    //         />
    //       </Grid.Col>
    //     )
    //   })}
    // </Grid>
    <Alert icon={<InfoIcon style={{ marginTop: 0 }} />} color="attention" variant="outline">
      Recommended banner sizes: {updatedBannerSizes.map((size) => size.value).join(', ')}
    </Alert>
  ) : null
}

export default BannerSizesList
