import {
  Button,
  Flex,
  Group,
  MantineTheme,
  Text,
  UnstyledButton,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { useDisclosure, useColorScheme } from '@mantine/hooks'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import { LaunchCampaignModal, SuccessModal } from 'components/common/Modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import useAccount from 'hooks/useAccount'
import { useNavigate } from 'react-router-dom'
import throttle from 'lodash.throttle'
import { createStyles } from '@mantine/emotion'

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
    campaign: { step, adUnits, autoUTMChecked, errorsTargetURLValidations },
    updateCampaign,
    publishCampaign,
    resetCampaign,
    saveToDraftCampaign,
    addUTMToTargetURLS,
    validateAdUnitTargetURL
  } = useCreateCampaignContext()
  const {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted
  } = useCreateCampaignData()
  const { showNotification } = useCustomNotifications()

  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false)
  const noSelectedCatsOrLogs = useMemo(
    () => !formattedCats || !formattedLocs,
    [formattedCats, formattedLocs]
  )

  useEffect(() => {
    setIsNextBtnDisabled((step === 0 && !adUnits.length) || (step === 1 && noSelectedCatsOrLogs))
  }, [step, noSelectedCatsOrLogs, adUnits])

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

  const handleNextStepBtnClicked = useCallback(() => {
    if (step === 0) {
      validateAdUnitTargetURL()
      if (Object.values(errorsTargetURLValidations).some((e) => !e.success)) {
        showNotification(
          'error',
          'Please enter a target URL starting with https://',
          'Invalid Target URL'
        )
        return
      }

      if (autoUTMChecked) {
        addUTMToTargetURLS()
      }
    }

    if (step < CREATE_CAMPAIGN_STEPS - 1) {
      if (step === 2) {
        const element = document.getElementById('createCampaignSubmitBtn1')
        element?.click()

        if (autoUTMChecked) {
          addUTMToTargetURLS()
        }
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
    errorsTargetURLValidations,
    validateAdUnitTargetURL
  ])

  const handleSaveDraftClicked = useCallback(async () => {
    try {
      const res = await saveToDraftCampaign()

      if (res && res.success) {
        resetCampaign()
        navigate('/dashboard/')
      } else {
        showNotification('warning', 'invalid campaign data response', 'Data error')
      }
    } catch (err) {
      console.error(err)
      showNotification('error', 'Creating campaign failed', 'Data error')
    }
  }, [resetCampaign, saveToDraftCampaign, showNotification, navigate])

  const handleOnModalClose = useCallback(() => {
    navigate('/dashboard/')
    close()
  }, [navigate, close])

  return (
    <>
      <Flex direction="column" pl="md" pr="md">
        <CampaignDetailsRow
          lighterColor
          title="Budget"
          value={campaignBudgetFormatted}
          textSize="sm"
        />
        <CampaignDetailsRow lighterColor title="CPM" value={priceBoundsFormatted} textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Device"
          textSize="sm"
          value={formattedSelectedDevice}
        />
        <CampaignDetailsRow lighterColor title="Ad Format" value={adFormats} textSize="sm" />
        <CampaignDetailsRow lighterColor title="Categories" value={formattedCats} textSize="sm" />
        <CampaignDetailsRow
          lighterColor
          title="Countries"
          value={formattedLocs}
          textSize="sm"
          noBorder
        />
      </Flex>
      {/* Temporary disabled */}
      {/* <Flex justify="space-between" className={classes.bg} p="lg">
        <Text c="secondaryText" fw="bold">
          Estimated Daily Impressions
        </Text>
        <Text c="secondaryText">0</Text>
      </Flex> */}
      <Flex direction="column" justify="space-between" align="center">
        {!isTheLastStep ? (
          <Button
            w="90%"
            disabled={isNextBtnDisabled}
            size="lg"
            mt="md"
            variant="filled"
            onClick={handleNextStepBtnClicked}
          >
            Next Step
          </Button>
        ) : (
          <LaunchCampaignModal
            w="90%"
            size="lg"
            mt="md"
            variant="filled"
            btnLabel="Launch Campaign"
            cancelBtnLabel="Go Back"
            confirmBtnLabel="Launch Campaign"
            onCancelClicked={() => console.log('Canceled')}
            onConfirmClicked={throttledLaunchCampaign}
          />
        )}
        <Button w="90%" size="lg" mt="md" variant="outline" onClick={handleSaveDraftClicked}>
          Save Draft
        </Button>
        <UnstyledButton
          variant="underlined"
          mt="sm"
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
      </Flex>
      <SuccessModal
        text="Campaign launched successfully!"
        opened={opened}
        close={handleOnModalClose}
      />
    </>
  )
}
export default CampaignSummary
