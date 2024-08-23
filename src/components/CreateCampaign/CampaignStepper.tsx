import { Stepper, StepperProps, rem } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'

function StyledStepper(props: StepperProps) {
  return (
    <Stepper
      iconSize={20}
      styles={{
        stepBody: {
          display: 'none'
        },
        step: {
          padding: 0
        },
        stepIcon: {
          borderWidth: rem(1),
          height: rem(10),
          width: rem(10),
          svg: {
            width: rem(10)
          }
        },
        separator: {
          marginLeft: rem(-2),
          marginRight: rem(-2),
          height: rem(1)
        }
      }}
      {...props}
    />
  )
}

const CustomStepper = ({ stepsCount }: { stepsCount: number }) => {
  const steps = Array.from(Array(stepsCount).keys())
  const { step } = useCreateCampaignContext()

  return (
    <StyledStepper icon=" " size="xs" active={step}>
      {steps.map((x) => (
        <Stepper.Step key={x} />
      ))}
    </StyledStepper>
  )
}

export default CustomStepper
