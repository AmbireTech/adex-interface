import { Button, Flex, Group, Text, UnstyledButton, createStyles } from '@mantine/core'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import CampaignDetailsRow from 'components/common/CampainDetailsRow'
import ConfirmModal from 'components/common/Modals/ConfirmModal'
import AttentionIcon from 'resources/icons/Attention'

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
  },
  brandColor: {
    color: theme.colors.brand[theme.fn.primaryShade()]
  },
  confirmModalContent: {
    background:
      theme.colors.attention[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
    padding: theme.spacing.md,
    border: `1px solid ${
      theme.colors.attention[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lighter
    }`,
    borderRadius: theme.spacing.sm
  },
  attentionIcon: {
    width: 25,
    height: 25,
    color: theme.colors.attention[theme.fn.primaryShade()]
  },
  iconWrapper: {
    width: 50,
    height: 50,
    // TODO: Add the suffix 1A to the theme
    background: `${theme.colors.attention[theme.fn.primaryShade()]}1A`,
    borderRadius: '50%',
    padding: theme.spacing.sm
  }
}))

const CampaignSummary = () => {
  const { classes, cx } = useStyles()
  const {
    campaign: { step, adUnits },
    updateCampaign,
    publishCampaign
  } = useCreateCampaignContext()
  const {
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted
  } = useCreateCampaignData()

  const [isNextBtnDisabled, setIsNextBtnDisabled] = useState(false)
  const noSelectedCatsOrLogs = useMemo(
    () => !formattedCats || !formattedLocs,
    [formattedCats, formattedLocs]
  )

  useEffect(() => {
    setIsNextBtnDisabled(
      (step === 0 && adUnits.length === 0) || (step === 1 && noSelectedCatsOrLogs)
    )
  }, [step, adUnits.length, noSelectedCatsOrLogs])

  const isTheLastStep = useMemo(() => step === CREATE_CAMPAIGN_STEPS - 1, [step])
  const isFirstStep = useMemo(() => step === 0, [step])
  const launchCampaign = useCallback(() => {
    // TODO:
    // Open Confirm modal here. On confirm publish Campaign
    publishCampaign()
      .then((res) => {
        // Congrats modal here
        // Clear the Campaign object
        console.log('response', res)
      })
      .catch((error) => {
        // TOOD: handle the error
        console.log('error', error.message)
      })
    console.log('LAUNCH CAMPAIGN')
  }, [publishCampaign])

  const form = useCreateCampaignFormContext()

  const handleNextStepBtnClicked = useCallback(() => {
    if (step < CREATE_CAMPAIGN_STEPS - 1) {
      if (step === 2) {
        form.validate()
        const isValidForm = form.isValid()
        if (!isValidForm) return
        const element = document.getElementById('createCampaignSubmitBtn')
        element?.click()
      }

      updateCampaign('step', step + 1)
    }
  }, [step, updateCampaign, form])

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
      <Flex justify="space-between" className={classes.bg} p="lg">
        <Text color="secondaryText" weight="bold">
          Estimated Daily Impressions
        </Text>
        <Text color="secondaryText">0</Text>
      </Flex>
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
          <ConfirmModal
            w="90%"
            size="lg"
            mt="md"
            variant="filled"
            title="Launch Campaign"
            btnLabel="Launch Campaign"
            cancelBtnLabel="Go Back"
            confirmBtnLabel="Launch Campaign"
            onCancelClicked={() => console.log('Canceled')}
            onConfirmClicked={launchCampaign}
          >
            <Flex justify="center" className={classes.confirmModalContent}>
              <div className={classes.iconWrapper}>
                <AttentionIcon className={classes.attentionIcon} />
              </div>
              <Text align="center">
                Once you click on “Launch campaign,” any further edits to the campaign will be
                disabled. Are you certain you wish to proceed with the launch?
              </Text>
            </Flex>
          </ConfirmModal>
        )}
        <Button w="90%" size="lg" mt="md" variant="outline">
          Save Draft
        </Button>
        <UnstyledButton
          variant="underlined"
          mt="sm"
          onClick={() => updateCampaign('step', step - 1)}
          disabled={isFirstStep}
          className={cx(classes.brandColor, { [classes.lightestBrandColor]: isFirstStep })}
        >
          <Group position="center" align="center" spacing="xs" h={50}>
            <span>
              <LeftArrowIcon className={classes.icon} />
            </span>
            <Text size="lg" weight="bold" underline>
              Go Back
            </Text>
          </Group>
        </UnstyledButton>
      </Flex>
    </>
  )
}

export default CampaignSummary
