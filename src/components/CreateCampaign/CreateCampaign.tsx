import { Grid, Stack, Paper } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect } from 'react'
import { modals } from '@mantine/modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom'
import { unstable_useBlocker as useBlocker } from 'react-router-dom'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
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

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      currentLocation.pathname !== nextLocation.pathname && campaign.draftModified,
    [campaign.draftModified]
  )

  const blocker: Blocker = useBlocker(shouldBlock)

  const saveDraft = useCallback(async () => {
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
  }, [showNotification, saveToDraftCampaign, campaign])

  useEffect(() => {
    if (blocker.state === 'blocked') {
      modals.openConfirmModal(
        defaultConfirmModalProps({
          text: 'You have unsaved changes. Do you want to save them as a draft?',
          color: 'attention',
          labels: { confirm: 'Leave the page', cancel: 'Save draft' },
          onConfirm: () => {
            blocker.proceed()
          },
          onCancel: () => {
            saveDraft()
            blocker.proceed()
          }
        })
      )
    }
  }, [blocker, saveDraft])

  return (
    <Grid columns={24} mr="xl" ml="xl" mt="md">
      <Grid.Col span={{ sm: 24, lg: 18 }}>
        <Paper p="md" shadow="xs">
          <Stack gap="xl">
            <CustomStepper />
            <Wizard step={step} />
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ sm: 24, lg: 6 }}>
        <Paper p="md" shadow="sm">
          <CampaignSummary />
        </Paper>
      </Grid.Col>
    </Grid>
  )
}

export default CreateCampaign
