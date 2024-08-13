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
import { useColorScheme } from '@mantine/hooks'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { useNavigate } from 'react-router-dom'
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
  const {
    campaign: { step, adUnits, autoUTMChecked },
    updateCampaign,
    resetCampaign,
    saveToDraftCampaign,
    addUTMToTargetURLS,
    form
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

  const hasFormValidationErrors = useMemo(() => Object.keys(form.errors).length > 0, [form.errors])

  const handleNextStepBtnClicked = useCallback(() => {
    if (form.validate().hasErrors) return
    if (step === 0) {
      if (hasFormValidationErrors) return

      if (autoUTMChecked) {
        addUTMToTargetURLS()
      }
    }
    if (step === 1) {
      if (hasFormValidationErrors) return
    }

    if (step < CREATE_CAMPAIGN_STEPS - 1) {
      if (step === 2) {
        if (hasFormValidationErrors) return
        if (autoUTMChecked) {
          addUTMToTargetURLS()
        }
      }

      updateCampaign({ step: step + 1 })
    }
  }, [step, updateCampaign, addUTMToTargetURLS, autoUTMChecked, form, hasFormValidationErrors])

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
          title="Device"
          textSize="sm"
          value={formattedSelectedDevice}
        />
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
      </Stack>
      {/* Temporary disabled */}
      {/* <Flex justify="space-between" className={classes.bg} p="lg">
        <Text c="secondaryText" fw="bold">
          Estimated Daily Impressions
        </Text>
        <Text c="secondaryText">0</Text>
      </Flex> */}
      <Stack align="center" justify="space-between" gap="sm" mt="xl">
        {!isTheLastStep && (
          <Button
            w="90%"
            disabled={isNextBtnDisabled}
            size="lg"
            variant="filled"
            onClick={handleNextStepBtnClicked}
          >
            Next Step
          </Button>
        )}
        {isTheLastStep && (
          <Button type="submit" w="90%" size="lg" variant="filled">
            Launch Campaign
          </Button>
        )}
        <Button w="90%" size="lg" variant="outline" onClick={handleSaveDraftClicked}>
          Save Draft
        </Button>
        <UnstyledButton
          variant="underlined"
          onClick={() => updateCampaign({ step: step - 1 })}
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
    </>
  )
}
export default CampaignSummary
