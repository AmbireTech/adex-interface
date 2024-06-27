import { Grid, createStyles } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useState } from 'react'
import { modals } from '@mantine/modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { deepEqual } from 'helpers/createCampaignHelpers'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import { CampaignUI } from 'types'
import { CustomConfirmModal } from 'components/common/Modals'
import CustomStepper from './CampaignStepper'
import CampaignSummary from './CampaignSummary'
import StepOne from './StepOne/StepOne'
import StepTwo from './StepTwo/StepTwo'
import StepThree from './StepThree/StepThree'
import StepFour from './StepFour/StepFour'

const useStyles = createStyles((theme) => {
  return {
    // TODO: Think about the idea to add the common container styles in the theme
    container: {
      backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs
      // padding: theme.spacing.lg
    },
    lightGray: {
      color: theme.fn.lighten(
        theme.colors.secondaryText[theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )
    },
    dropZone: {
      backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
      border: '1px solid',
      borderRadius: theme.radius.sm,
      borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      height: 112
    },
    decorativeBorder: {
      width: '99%',
      height: '99%',
      border: '1px dashed',
      borderRadius: theme.radius.sm
    },
    body: {
      background:
        theme.colors.attention[theme.fn.primaryShade()] +
        theme.other.shades.hexColorSuffix.lightest,
      padding: theme.spacing.xl
    },
    confirmModalContent: {
      background:
        theme.colors.attention[theme.fn.primaryShade()] +
        theme.other.shades.hexColorSuffix.lightest,
      padding: theme.spacing.xl
    },
    iconWrapper: {
      width: 50,
      height: 50,
      background: `${theme.colors.attention[theme.fn.primaryShade()]}1A`,
      borderRadius: '50%',
      padding: theme.spacing.sm
    },
    attentionIcon: {
      width: 25,
      height: 25,
      color: theme.colors.attention[theme.fn.primaryShade()]
    },
    modalBody: {
      padding: 0
    }
  }
})

const Wizard = ({ step }: { step: number }) => {
  switch (step) {
    case 0:
      return <StepOne />
    case 1:
      return <StepTwo />
    case 2:
      return <StepThree />
    case 3:
      return <StepFour />
    default:
      return null
  }
}

const CreateCampaign = () => {
  const { classes } = useStyles()
  const {
    campaign,
    campaign: { step },
    saveToDraftCampaign
  } = useCreateCampaignContext()
  const { showNotification } = useCustomNotifications()
  const [campaignInitialState, setCampaignInitialState] = useState<CampaignUI | null>(null)
  const [openedModal, setOpenedModal] = useState(false)

  const blocker: Blocker = useBlocker(
    useCallback<BlockerFunction>(
      ({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname,
      []
    )
  )

  const blockerProceed = useCallback(() => blocker.proceed?.(), [blocker])

  const handleConfirmBtnClicked = useCallback(async () => {
    try {
      const res = await saveToDraftCampaign(campaign)

      if (res && res.success) {
        showNotification('info', 'Draft saved')
      } else {
        showNotification('warning', 'invalid campaign data response', 'Data error')
      }
    } catch (err) {
      console.error(err)
      showNotification('error', 'Creating campaign failed', 'Data error')
    }
    modals.closeAll()
    blockerProceed()
  }, [showNotification, saveToDraftCampaign, blockerProceed, campaign])

  const handleCancelBtnClicked = useCallback(() => {
    if (blocker.state === 'blocked') blockerProceed()
  }, [blocker.state, blockerProceed])

  useEffect(() => {
    if (
      blocker.state === 'blocked' &&
      !!campaignInitialState &&
      !deepEqual(campaign, campaignInitialState)
    ) {
      setOpenedModal(true)
    } else if (blocker.state === 'blocked') {
      blockerProceed()
    }
  }, [blocker, campaignInitialState, campaign, blockerProceed])

  useEffect(() => {
    setCampaignInitialState((p) => {
      let next = p && { ...p }
      if (!next) {
        next = campaign
      }
      return next
    })
  }, []) // eslint-disable-line

  return (
    <>
      <Grid columns={24} align="flex-start" mr="xl" ml="xl" mt="md">
        <Grid.Col sm={24} md={15} lg={18} className={classes.container} p="lg">
          <Grid p="md">
            <Grid.Col>
              <CustomStepper />
            </Grid.Col>
            <Grid.Col>
              <Wizard step={step} />
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col
          sm={24}
          md={8}
          lg={5}
          offset={1}
          className={classes.container}
          style={{ height: 'auto', padding: 0 }}
        >
          <CampaignSummary />
        </Grid.Col>
      </Grid>
      <CustomConfirmModal
        cancelBtnLabel="No"
        confirmBtnLabel="Yes"
        onCancelClicked={handleCancelBtnClicked}
        onConfirmClicked={handleConfirmBtnClicked}
        color="attention"
        text="You may have unsaved changes. Do you want to save them as a draft?"
        opened={openedModal}
      />
    </>
  )
}

export default CreateCampaign
