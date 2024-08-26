import { Flex, Stack, Paper, Text, Box } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { modals } from '@mantine/modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import type {
  unstable_Blocker as Blocker,
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom'
import { unstable_useBlocker as useBlocker, useNavigate } from 'react-router-dom'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
import useAccount from 'hooks/useAccount'
import throttle from 'lodash.throttle'
import { SuccessModal } from 'components/common/Modals'
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
  const [isSuccessModalOpened, SetIsSuccessModalOpened] = useState(false)
  const { updateBalance } = useAccount()
  const navigate = useNavigate()
  const { publishCampaign, resetCampaign, form, step } = useCreateCampaignContext()
  const { showNotification } = useCustomNotifications()

  const shouldBlock = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) => currentLocation.pathname !== nextLocation.pathname,
    []
  )

  const blocker: Blocker = useBlocker(shouldBlock)

  useEffect(() => {
    if (blocker.state === 'blocked') {
      resetCampaign('Leave without saving', () => blocker.proceed())
    }
  }, [blocker, resetCampaign])

  const launchCampaign = useCallback(async () => {
    try {
      const res = await publishCampaign()

      if (res && res.success) {
        await updateBalance()
        SetIsSuccessModalOpened(true)
        resetCampaign()
      } else {
        showNotification('warning', 'invalid campaign data response', 'Data error')
      }
    } catch (err) {
      console.error(err)
      showNotification('error', 'Creating campaign failed', 'Data error')
    }
  }, [publishCampaign, resetCampaign, SetIsSuccessModalOpened, showNotification, updateBalance])

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

  const handleOnModalClose = useCallback(() => {
    navigate('/dashboard/')
    SetIsSuccessModalOpened(false)
  }, [navigate, SetIsSuccessModalOpened])

  return (
    <form onSubmit={form.onSubmit(confirmLaunch)}>
      <Flex direction="row" gap="xl" wrap="wrap" align="flex-start">
        <Paper p="md" shadow="xs" style={{ flexGrow: 10 }} w={720} maw="100%">
          <Stack gap="xl">
            <CustomStepper stepsCount={4} />
            <Box>
              <Wizard step={step} />
            </Box>
          </Stack>
        </Paper>

        <Paper p="md" shadow="sm" w={345} style={{ flexGrow: 1 }}>
          <CampaignSummary />
        </Paper>
      </Flex>
      <SuccessModal
        text={
          <Text p="md">
            Your campaign has been successfully launched and is now under review.{' '}
            <strong>It may take up to 24 hours for your campaign to be activated</strong>. Thank you
            for your patience!
          </Text>
        }
        opened={isSuccessModalOpened}
        close={handleOnModalClose}
      />
    </form>
  )
}

export default CreateCampaign
