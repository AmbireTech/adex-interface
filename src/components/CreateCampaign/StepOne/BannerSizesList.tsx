import { Grid } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import {
  checkBannerSizes,
  checkSelectedDevices,
  selectBannerSizes
} from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { AdUnit } from 'adex-common/dist/types'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import { SupplyStatsDetails } from 'types'

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
    supplyStats
  } = useCreateCampaignContext()

  const { uniqueSizesWithCount } = useCreateCampaignData()

  const mappedSupplyStats: Record<string, SupplyStatsDetails[]> = useMemo(
    () => selectBannerSizes(supplyStats),
    [supplyStats]
  )

  const selectedPlatform = useMemo(
    () => (placement === 'app' ? placement : checkSelectedDevices(devices)),
    [placement, devices]
  )
  const selectedBannerSizes = useMemo(
    () => (selectedPlatform ? mappedSupplyStats[selectedPlatform] : []),
    [selectedPlatform, mappedSupplyStats]
  )

  const updatedBannerSizes = useMemo(
    () =>
      selectedBannerSizes && selectedBannerSizes.length
        ? checkBannerSizes(selectedBannerSizes, adUnits)
            .sort((a, b) => b.count - a.count)
            // Note: remove duplicate banner sizes of mobile and desktop devices when both selected
            .reduce((acc: SupplyStatsDetails[], curr: SupplyStatsDetails) => {
              if (!acc.find((item) => item.value === curr.value)) {
                acc.push(curr)
              }
              return acc
            }, [])
            .slice(0, 10)
        : [],
    [adUnits, selectedBannerSizes]
  )

  return updatedBannerSizes ? (
    <Grid>
      {updatedBannerSizes.map((item) => {
        const addedBannerCount = uniqueSizesWithCount.find(
          ({ value }) => item.value === value
        )?.count

        return (
          <Grid.Col span="content" key={`${item.value}+${item.count}`}>
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
