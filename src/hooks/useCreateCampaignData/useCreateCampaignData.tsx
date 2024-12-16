import { useMemo } from 'react'
import { Flex, Text, Stack, NumberFormatter } from '@mantine/core'
import { checkSelectedDevices, findDuplicates } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { AdUnit } from 'adex-common/dist/types'
import { CATEGORIES, COUNTRIES, SSPs } from 'constants/createCampaign'
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
          ssp,
          placements: {
            in: [placement]
          }
        }
      },
      cpmPricingBounds,
      adUnits,
      budget,
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
    return <Text ta="end">N/A</Text>
  }, [selectedDevices])

  const formattedSelectedPlacement = useMemo(() => {
    if (placement) return <Text ta="end">{placement === 'app' ? 'Applications' : 'Websites'}</Text>
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
    () => <CatsLocsFormatted inputValues={categories} selectData={CATEGORIES} align="end" />,
    [categories]
  )
  const formattedLocs = useMemo(
    () => <CatsLocsFormatted inputValues={location} selectData={COUNTRIES} align="end" />,
    [location]
  )

  const formattedSSPs = useMemo(
    () => ssp && <CatsLocsFormatted inputValues={ssp} selectData={SSPs} align="end" />,
    [ssp]
  )

  const sizes = useMemo(
    () => adUnits.map((adUnit: AdUnit) => `${adUnit.banner?.format.w}x${adUnit.banner?.format.h}`),
    [adUnits]
  )
  const uniqueSizesWithCount = useMemo(() => findDuplicates(sizes), [sizes])
  const adFormats = useMemo(
    () => (
      <Stack gap={0} align="end">
        {uniqueSizesWithCount.map((size) => (
          <Text key={`${size.count}${size.value}`}>{`${size.count}x ${size.value}`}</Text>
        ))}
      </Stack>
    ),
    [uniqueSizesWithCount]
  )

  const campaignBudgetFormatted = useMemo(() => budget.toString(), [budget])
  const campaignNameFormatted = useMemo(() => title, [title])
  const adUnitsFormatted = useMemo(
    () => (
      <Stack gap="xs">
        {adUnits.map((image: AdUnit) => {
          return <ImageUrlInput key={image.id} image={image} preview />
        })}
      </Stack>
    ),
    [adUnits]
  )

  const estimatedImpressions = useMemo(() => {
    const estimatedMinImpressions = Math.floor(
      (budget / (Number(cpmPricingBounds.max) || 0.01)) * 1000
    )
    const estimatedMaxImpressions = Math.floor(
      (budget / (Number(cpmPricingBounds.min) || 0.01)) * 1000
    )

    const min = estimatedMinImpressions.toFixed(0)
    const max = estimatedMaxImpressions.toFixed(0)

    return (
      <Stack gap={0} align="end" c="success" fw="bold">
        <NumberFormatter prefix="min: " value={min} thousandSeparator />
        <NumberFormatter prefix="max: " value={max} thousandSeparator />
      </Stack>
    )
  }, [budget, cpmPricingBounds.max, cpmPricingBounds.min])

  return {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    formattedSSPs,
    adFormats,
    advancedTargeInput: advanced,
    campaignBudgetFormatted,
    campaignNameFormatted,
    adUnitsFormatted,
    campaignPeriodFormatted,
    uniqueSizesWithCount,
    formattedSelectedPlacement,
    estimatedImpressions
  }
}

export default useCreateCampaignData
