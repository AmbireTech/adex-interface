import {
  Button,
  Group,
  MantineTheme,
  Stack,
  Text,
  UnstyledButton,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { useDisclosure, useColorScheme } from '@mantine/hooks'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useMemo } from 'react'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import { SuccessModal } from 'components/common/Modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import useAccount from 'hooks/useAccount'
import { useNavigate } from 'react-router-dom'
import throttle from 'lodash.throttle'
import { createStyles } from '@mantine/emotion'
import { modals } from '@mantine/modals'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
import { UtmInfo } from './CreateCampaignCommon'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    bg: {
      background: lighten(theme.colors.warning[primaryShade], theme.other.shades.lighten.lightest)
    },
    icon: {
      width: 14,
      height: 14
    },
    lightestBrandColor: {
      color: lighten(theme.colors.brand[primaryShade], theme.other.shades.lighten.lighter)
    },
    brandColor: {
      color: theme.colors.brand[primaryShade]
    }
  }
})

const CampaignSummary = () => {
  const { classes, cx } = useStyles()
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const { updateBalance } = useAccount()
  const {
    campaign: {
      step,
      adUnits,
      autoUTMChecked,
      errorsTargetURLValidations,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          },
          categories,
          location
        }
      }
    },
    updateCampaign,
    updatePartOfCampaign,
    publishCampaign,
    resetCampaign,
    saveToDraftCampaign,
    addUTMToTargetURLS
  } = useCreateCampaignContext()
  const {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted,
    advancedTargeInput
  } = useCreateCampaignData()
  const { showNotification } = useCustomNotifications()

  const nextStepDisabled = useMemo(() => {
    if (step === 0) {
      return !adUnits.length || Object.values(errorsTargetURLValidations).some((e) => !e.success)
    }
    if (step === 1) {
      return !(
        (categories.apply === 'all' ||
          (categories.apply === 'in' && categories.in.length) ||
          (categories.apply === 'nin' && categories.nin.length)) &&
        (location.apply === 'all' ||
          (location.apply === 'in' && location.in.length) ||
          (location.apply === 'nin' && location.nin.length))
      )
    }

    return false
  }, [
    adUnits.length,
    categories.apply,
    categories.in.length,
    categories.nin.length,
    errorsTargetURLValidations,
    location.apply,
    location.in.length,
    location.nin.length,
    step
  ])

  const isTheLastStep = useMemo(() => step === CREATE_CAMPAIGN_STEPS - 1, [step])
  const isFirstStep = useMemo(() => step === 0, [step])

  const launchCampaign = useCallback(async () => {
    try {
      const res = await publishCampaign()

      if (res && res.success) {
        await updateBalance()
        open()
        resetCampaign()
      } else {
        showNotification('warning', 'invalid campaign data response', 'Data error')
      }
    } catch (err) {
      console.error(err)
      showNotification('error', 'Creating campaign failed', 'Data error')
    }
  }, [publishCampaign, resetCampaign, open, showNotification, updateBalance])

  const throttledLaunchCampaign = useMemo(
    () => throttle(launchCampaign, 1069, { leading: true }),
    [launchCampaign]
  )

  const confirmLaunch = useCallback(() => {
    return modals.openConfirmModal(
      defaultConfirmModalProps({
        text: "Once you click on 'Launch campaign' any creative updates disabled. Are you certain you wish to proceed with the launch?",
        color: 'attention',
        labels: { confirm: 'Launch Campaign', cancel: 'Continue edit' },
        onConfirm: () => {
          throttledLaunchCampaign()
        }
      })
    )
  }, [throttledLaunchCampaign])

  const handleNextStepBtnClicked = useCallback(() => {
    if (step === 0) {
      if (Object.values(errorsTargetURLValidations).some((e) => !e.success)) {
        showNotification(
          'error',
          'Please enter a target URL starting with https://',
          'Invalid Target URL'
        )
        return
      }
    }

    if (step === 2 && autoUTMChecked) {
      addUTMToTargetURLS()
    }

    if (step < CREATE_CAMPAIGN_STEPS - 1) {
      if (step === 2) {
        // NOTE: wtf?
        const element = document.getElementById('createCampaignSubmitBtn1')
        element?.click()
        return
      }

      updateCampaign('step', step + 1)
    }
  }, [
    step,
    updateCampaign,
    showNotification,
    addUTMToTargetURLS,
    autoUTMChecked,
    errorsTargetURLValidations
  ])

  const handleSaveDraftClicked = useCallback(async () => {
    try {
      const res = await saveToDraftCampaign()

      if (res && res.success) {
        updatePartOfCampaign({ dirty: false })
        showNotification('info', 'Draft saved')
      } else {
        showNotification('warning', 'invalid campaign data response', 'Data error')
      }
    } catch (err) {
      console.error(err)
      showNotification('error', 'Creating campaign failed', 'Data error')
    }
  }, [saveToDraftCampaign, showNotification, updatePartOfCampaign])

  const handleOnModalClose = useCallback(() => {
    navigate('/dashboard/')
    close()
  }, [navigate, close])

  return (
    <>
      <Stack align="stretch">
        <CampaignDetailsRow
          lighterColor
          title="Budget"
          value={campaignBudgetFormatted}
          textSize="sm"
        />
        <CampaignDetailsRow lighterColor title="CPM" value={priceBoundsFormatted} textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Placement"
          value={placement === 'site' ? 'Website' : 'App'}
          textSize="sm"
        />
        {placement === 'site' && (
          <CampaignDetailsRow
            lighterColor
            title="Device"
            textSize="sm"
            value={formattedSelectedDevice}
          />
        )}
        <CampaignDetailsRow lighterColor title="Ad Format" value={adFormats} textSize="sm" />
        <CampaignDetailsRow lighterColor title="Categories" value={formattedCats} textSize="sm" />
        <CampaignDetailsRow lighterColor title="Countries" value={formattedLocs} textSize="sm" />
        {/* <CampaignDetailsRow
          mt="md"
          lighterColor
          lineHeight="xs"
          title="Include incentivized traffic"
          value={advancedTargeInput.includeIncentivized ? 'Yes' : 'No'}
          textSize="sm"
          noBorder
        />
        <CampaignDetailsRow
          lighterColor
          lineHeight="xs"
          title="Disable frequency capping"
          value={advancedTargeInput.disableFrequencyCapping ? 'Yes' : 'No'}
          textSize="sm"
          noBorder
        /> */}
        <CampaignDetailsRow
          lighterColor
          lineHeight="xs"
          title="Limit average daily spending"
          value={advancedTargeInput.limitDailyAverageSpending ? 'Yes' : 'No'}
          textSize="sm"
          noBorder
          mb="xs"
        />

        <CampaignDetailsRow
          lighterColor
          lineHeight="xs"
          title="Auto UTM tracking"
          value={
            <Group gap="sm">
              <Text size="inherit" c={autoUTMChecked ? 'success' : 'warning'}>
                {autoUTMChecked ? 'Enabled' : 'Disabled'}
              </Text>
              <UtmInfo title="" placement={placement} />
            </Group>
          }
          textSize="sm"
          noBorder
          mb="xs"
        />
      </Stack>
      {/* Temporary disabled */}
      {/* <Flex justify="space-between" className={classes.bg} p="lg">
        <Text c="secondaryText" fw="bold">
          Estimated Daily Impressions
        </Text>
        <Text c="secondaryText">0</Text>
      </Flex> */}
      <Stack align="center" justify="space-between" gap="sm" mt="xl">
        {!isTheLastStep ? (
          <Button
            w="90%"
            disabled={nextStepDisabled}
            size="lg"
            variant="filled"
            onClick={handleNextStepBtnClicked}
          >
            Next Step
          </Button>
        ) : (
          <Button w="90%" size="lg" variant="filled" onClick={confirmLaunch}>
            Launch Campaign
          </Button>
        )}
        <Button w="90%" size="lg" variant="outline" onClick={handleSaveDraftClicked}>
          Save Draft
        </Button>
        <UnstyledButton
          variant="underlined"
          onClick={() => updateCampaign('step', step - 1)}
          disabled={isFirstStep}
          className={cx(classes.brandColor, { [classes.lightestBrandColor]: isFirstStep })}
        >
          <Group justify="center" align="center" gap="xs" h={50}>
            <span>
              <LeftArrowIcon className={classes.icon} />
            </span>
            <Text size="lg" fw="bold" td="underline">
              Go Back
            </Text>
          </Group>
        </UnstyledButton>
      </Stack>
      <SuccessModal
        text={
          <Text p="md">
            Your campaign has been successfully launched and is now under review.{' '}
            <strong>It may take up to 24 hours for your campaign to be activated</strong>. Thank you
            for your patience!
          </Text>
        }
        opened={opened}
        close={handleOnModalClose}
      />
    </>
  )
}
export default CampaignSummary
