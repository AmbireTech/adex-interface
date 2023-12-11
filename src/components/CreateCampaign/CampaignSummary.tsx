import { Button, Flex, Group, Text, UnstyledButton, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import { CREATE_CAMPAIGN_STEPS, CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import { checkSelectedDevices, formatCatsAndLocsData } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useMemo } from 'react'
import DesktopIcon from 'resources/icons/Desktop'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import MobileIcon from 'resources/icons/Mobile'
import { SelectData, TargetingInputSingle } from 'types'

const useStyles = createStyles((theme) => ({
  bg: {
    background:
      theme.colors.warning[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest
  },
  icon: {
    width: 14,
    height: 14
  },
  lightestBrandColor: {
    color: theme.colors.brand[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lighter
  }
}))

const CampaignSummary = () => {
  const { classes } = useStyles()
  const {
    campaign: {
      devices,
      step,
      targetingInput: {
        inputs: { location, categories }
      }
    },
    updateCampaign
  } = useCreateCampaignContext()

  const selectedDevices = useMemo(() => checkSelectedDevices(devices), [devices])
  const FormattedSelectedDevice = useMemo(
    () =>
      selectedDevices === 'desktop' ? (
        <Flex align="center" gap={5}>
          <DesktopIcon size="16px" /> Desktop
        </Flex>
      ) : selectedDevices === 'mobile' ? (
        <Flex align="center" gap={5}>
          <MobileIcon size="16px" /> Mobile
        </Flex>
      ) : selectedDevices === 'both' ? (
        <Flex align="center" gap={5}>
          <MobileIcon size="16px" /> Mobile
          <DesktopIcon size="16px" /> Desktop
        </Flex>
      ) : null,
    [selectedDevices]
  )
  const formatCatsAndLocs = useCallback((inputValues: TargetingInputSingle, lib: SelectData[]) => {
    const [key, labels] = formatCatsAndLocsData(inputValues, lib)

    if (!key) return
    if (key === 'allIn') {
      return <Text>All</Text>
    }
    if (key === 'in') return <Text>{labels}</Text>
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

  const isTheLastStep = useMemo(() => step === CREATE_CAMPAIGN_STEPS - 1, [step])
  const launchCampaign = () => console.log('LAUNCH CAMPAIGN')

  return (
    <>
      <Flex direction="column" pl="md" pr="md">
        <CampaignDetailsRow lighterColor title="Budget" value="-" textSize="sm" />
        <CampaignDetailsRow lighterColor title="CPM" value="-" textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Device"
          textSize="sm"
          value={FormattedSelectedDevice}
        />
        <CampaignDetailsRow lighterColor title="Ad Format" value="-" textSize="sm" />
        <CampaignDetailsRow lighterColor title="Categories" value={formattedCats} textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Countries"
          value={formattedLocs}
          textSize="sm"
          noBorder
        />
      </Flex>
      <Flex justify="space-between" className={classes.bg} p="lg">
        <Text color="secondaryText" weight="bold">
          Estimated Daily Impressions
        </Text>
        <Text color="secondaryText">0</Text>
      </Flex>
      <Flex direction="column" justify="space-between" align="center">
        <Button
          w="90%"
          size="lg"
          mt="md"
          variant="filled"
          onClick={() =>
            step < CREATE_CAMPAIGN_STEPS - 1
              ? updateCampaign('step', step + 1)
              : isTheLastStep && launchCampaign()
          }
        >
          {isTheLastStep ? 'Launch Campaign' : 'Next Step'}
        </Button>
        <Button w="90%" size="lg" mt="md" variant="outline">
          Save Draft
        </Button>
        <UnstyledButton variant="underlined" mt="sm">
          <Group
            position="center"
            onClick={() => step > 0 && updateCampaign('step', step - 1)}
            align="center"
            spacing="xs"
            h={50}
          >
            <span className={classes.lightestBrandColor}>
              <LeftArrowIcon className={classes.icon} />
            </span>
            <Text size="lg" weight="bold" underline className={classes.lightestBrandColor}>
              Go Back
            </Text>
          </Group>
        </UnstyledButton>
      </Flex>
    </>
  )
}

export default CampaignSummary
