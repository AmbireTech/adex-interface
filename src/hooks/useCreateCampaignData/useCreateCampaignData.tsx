import { useMemo, useCallback } from 'react'
import { Flex, Text, Group } from '@mantine/core' // Assuming the necessary components are imported
import {
  checkSelectedDevices,
  findDuplicates,
  formatCatsAndLocsData
} from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { AdUnit, TargetingInputSingle } from 'adex-common/dist/types'
import { SelectData } from 'types'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import ImageUrlInput from 'components/CreateCampaign/StepOne/ImageUrlInput'

const useCreateCampaignData = () => {
  const {
    campaign: {
      devices,
      targetingInput: {
        inputs: { location, categories }
      },
      pricingBounds: { IMPRESSION: priceBounds },
      adUnits,
      campaignBudget,
      campaignName
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
    return null
  }, [selectedDevices])

  const priceBoundsFormatted = useMemo(
    () => (
      <Group spacing="xs">
        <Group spacing="xs">
          <Text color="brand" size="sm">
            Min:
          </Text>
          <Text>{priceBounds?.min.toString()}</Text>
        </Group>
        <Group spacing="xs" style={{ borderLeft: '1px solid lightgray' }} pl="xs">
          <Text color="brand" size="sm">
            Max:
          </Text>
          <Text>{priceBounds?.max.toString()}</Text>
        </Group>
      </Group>
    ),
    [priceBounds?.min, priceBounds?.max]
  )

  const formatCatsAndLocs = useCallback((inputValues: TargetingInputSingle, lib: SelectData[]) => {
    const [key, labels] = formatCatsAndLocsData(inputValues, lib)
    if (!key) return
    if (key === 'all') {
      return <Text align="end">All</Text>
    }
    if (key === 'in') {
      return <Text align="end">{labels}</Text>
    }
    if (key === 'nin') {
      return (
        <>
          <Text align="end" color="warning">
            All except:{' '}
          </Text>
          <Text align="end">{labels}</Text>
        </>
      )
    }
  }, [])

  const formattedCats = useMemo(
    () => formatCatsAndLocs(categories, CATEGORIES),
    [formatCatsAndLocs, categories]
  )
  const formattedLocs = useMemo(
    () => formatCatsAndLocs(location, COUNTRIES),
    [formatCatsAndLocs, location]
  )

  const sizes = useMemo(
    () => adUnits.map((adUnit) => `${adUnit.banner?.format.w}x${adUnit.banner?.format.h}`),
    [adUnits]
  )
  const uniqueSizesWithCount = useMemo(() => findDuplicates(sizes), [sizes])
  const adFormats = useMemo(
    () =>
      uniqueSizesWithCount.map((size) => (
        <Text align="end" key={`${size.count}${size.value}`}>{`${size.count}x ${size.value}`}</Text>
      )),
    [uniqueSizesWithCount]
  )
  const campaignBudgetFormatted = useMemo(
    () => <Text align="end">{campaignBudget.toString()}</Text>,
    [campaignBudget]
  )
  const campaignNameFormatted = useMemo(
    () => <Text align="end">{campaignName.toString()}</Text>,
    [campaignName]
  )
  const adUnitsFormatted = useMemo(
    () =>
      adUnits.map((image: AdUnit) => {
        return <ImageUrlInput image={image} mb="sm" preview />
      }),
    [adUnits]
  )

  return {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted,
    campaignNameFormatted,
    adUnitsFormatted
  }
}

export default useCreateCampaignData
