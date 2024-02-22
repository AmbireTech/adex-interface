import { Button, Flex, Group, Text, UnstyledButton, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import LeftArrowIcon from 'resources/icons/LeftArrow'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'

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
    campaign: { step, adUnits },
    updateCampaign
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
    if ((step === 0 && adUnits.length === 0) || (step === 1 && noSelectedCatsOrLogs)) {
      setIsNextBtnDisabled(true)
    } else {
      setIsNextBtnDisabled(false)
    }
  }, [step, adUnits.length, noSelectedCatsOrLogs])

  const isTheLastStep = useMemo(() => step === CREATE_CAMPAIGN_STEPS - 1, [step])
  const launchCampaign = () => {
    // TODO: REVOKE all the blob URLs
    // URL.revokeObjectURL(storedImageURL);
    console.log('LAUNCH CAMPAIGN')
  }
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
      return
    }

    if (isTheLastStep) {
      launchCampaign()
    }
  }, [isTheLastStep, step, updateCampaign, form])

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
        <Button
          w="90%"
          disabled={isNextBtnDisabled}
          size="lg"
          mt="md"
          variant="filled"
          onClick={handleNextStepBtnClicked}
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