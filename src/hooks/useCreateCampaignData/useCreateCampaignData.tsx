import { useMemo } from 'react'
import { Flex, Text, Stack } from '@mantine/core'
import {
  checkSelectedDevices,
  findDuplicates,
  formatCatsAndLocsData
} from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { AdUnit } from 'adex-common/dist/types'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import ImageUrlInput from 'components/CreateCampaign/StepOne/ImageUrlInput'
import RangeText from 'components/common/RangeText'
import dayjs from 'dayjs'
import CatsLocsFormatted from 'components/CampaignDetails/CatsLocsFormatted'

const useCreateCampaignData = () => {
  const {
    campaign: {
      devices,
      targetingInput: {
        inputs: {
          advanced,
          location,
          categories,
          placements: {
            in: [placement]
          }
        }
      },
      cpmPricingBounds,
      adUnits,
      campaignBudget,
      title,
      startsAt,
      endsAt
    }
  } = useCreateCampaignContext()

  const selectedDevices = useMemo(() => checkSelectedDevices(devices), [devices])

  const formattedSelectedDevice = useMemo(() => {
    if (selectedDevices === 'desktop') {
      return (
        <Flex align="center" gap={5}>
          <DesktopIcon size="16px" /> Desktop
        </Flex>
      )
    }
    if (selectedDevices === 'mobile') {
      return (
        <Flex align="center" gap={5}>
          <MobileIcon size="16px" /> Mobile
        </Flex>
      )
    }

    if (selectedDevices === 'both') {
      return (
        <Flex align="center" gap={5}>
          <MobileIcon size="16px" /> Mobile
          <DesktopIcon size="16px" /> Desktop
        </Flex>
      )
    }
    return <Text align="end">N/A</Text>
  }, [selectedDevices])

  const formattedSelectedPlacement = useMemo(() => {
    if (placement)
      return <Text align="end">{placement === 'app' ? 'Applications' : 'Websites'}</Text>
    return null
  }, [placement])

  const priceBoundsFormatted = useMemo(
    () => (
      <RangeText
        labelOne="Min"
        valueOne={cpmPricingBounds.min.toString() || ''}
        labelTwo="Max"
        valueTwo={cpmPricingBounds.max.toString() || ''}
      />
    ),
    [cpmPricingBounds]
  )

  const startsAtFormatted = useMemo(() => dayjs(startsAt).format('DD/MM/YYYY HH:mm'), [startsAt])
  const endsAtFormatted = useMemo(() => dayjs(endsAt).format('DD/MM/YYYY HH:mm'), [endsAt])

  const campaignPeriodFormatted = useMemo(
    () => (
      <RangeText
        labelOne="Starts at"
        valueOne={startsAtFormatted}
        labelTwo="Ends at"
        valueTwo={endsAtFormatted}
      />
    ),
    [startsAtFormatted, endsAtFormatted]
  )

  const formattedCats = useMemo(
    () => <CatsLocsFormatted arr={formatCatsAndLocsData(categories, CATEGORIES)} />,
    [categories]
  )
  const formattedLocs = useMemo(
    () => <CatsLocsFormatted arr={formatCatsAndLocsData(location, COUNTRIES)} />,
    [location]
  )

  const sizes = useMemo(
    () => adUnits.map((adUnit) => `${adUnit.banner?.format.w}x${adUnit.banner?.format.h}`),
    [adUnits]
  )
  const uniqueSizesWithCount = useMemo(() => findDuplicates(sizes), [sizes])
  const adFormats = useMemo(
    () => (
      <Stack spacing={0} align="end">
        {uniqueSizesWithCount.map((size) => (
          <Text key={`${size.count}${size.value}`}>{`${size.count}x ${size.value}`}</Text>
        ))}
      </Stack>
    ),
    [uniqueSizesWithCount]
  )

  const campaignBudgetFormatted = useMemo(() => campaignBudget.toString(), [campaignBudget])
  const campaignNameFormatted = useMemo(() => title, [title])
  const adUnitsFormatted = useMemo(
    () => (
      <Stack>
        {adUnits.map((image: AdUnit) => {
          return <ImageUrlInput key={image.id} image={image} mb="sm" preview />
        })}
      </Stack>
    ),
    [adUnits]
  )

  return {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    advancedTargeInput: advanced,
    campaignBudgetFormatted,
    campaignNameFormatted,
    adUnitsFormatted,
    campaignPeriodFormatted,
    uniqueSizesWithCount,
    formattedSelectedPlacement
  }
}

export default useCreateCampaignData
