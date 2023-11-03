import { Stepper } from '@mantine/core'
import { CustomStepperProps } from 'types'

function CustomStepper({ active, stepsCount }: CustomStepperProps) {
  const steps = Array.from({ length: stepsCount }, (_, index) => index + 1)

  return (
    <Stepper icon=" " size="xs" active={active}>
      {steps.map((step) => (
        <Stepper.Step key={step} />
      ))}
    </Stepper>
  )
}

export default CustomStepper
