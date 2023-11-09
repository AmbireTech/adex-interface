import { Stepper } from '@mantine/core'
import { CREATE_CAMPAIGN_STEPS } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'

function CustomStepper() {
  const steps = Array.from({ length: CREATE_CAMPAIGN_STEPS }, (_, index) => index + 1)
  const {
    campaign: { step }
  } = useCreateCampaignContext()

  return (
    <Stepper icon=" " size="xs" active={step}>
      {steps.map((x) => (
        <Stepper.Step key={x} />
      ))}
    </Stepper>
  )
}

export default CustomStepper
