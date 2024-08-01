import { Grid, Stack, Paper } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useState } from 'react'
import { modals } from '@mantine/modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import { CustomConfirmModal } from 'components/common/Modals'
import CustomStepper from './CampaignStepper'
import CampaignSummary from './CampaignSummary'
import StepOne from './StepOne/StepOne'
import StepTwo from './StepTwo/StepTwo'
import StepThree from './StepThree/StepThree'
import StepFour from './StepFour/StepFour'

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
  const {
    campaign,
    campaign: { step },
    saveToDraftCampaign
  } = useCreateCampaignContext()
  const { showNotification } = useCustomNotifications()
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
    if (blocker.state === 'blocked' && campaign.draftModified) {
      setOpenedModal(true)
    } else if (blocker.state === 'blocked') {
      blockerProceed()
    }
  }, [blocker, campaign, blockerProceed])

  return (
    <>
      <Grid columns={24} mr="xl" ml="xl" mt="md">
        <Grid.Col xs={24} lg={18}>
          <Paper p="md">
            <Stack spacing="xl">
              <CustomStepper />
              <Wizard step={step} />
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col sm={24} lg={6}>
          <Paper p="md">
            <CampaignSummary />
          </Paper>
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
