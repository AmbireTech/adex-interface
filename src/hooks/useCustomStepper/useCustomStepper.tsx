import { useState } from 'react'
import { UseCustomStepperProps } from 'types'

const useCustomStepper = ({ stepsCount }: UseCustomStepperProps) => {
  const [activeStep, setActiveStep] = useState(0)

  const nextStep = () => {
    setActiveStep((prevStep) => (prevStep < stepsCount ? prevStep + 1 : prevStep))
  }

  const previousStep = () => {
    setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep))
  }

  return {
    activeStep,
    nextStep,
    previousStep
  }
}

export default useCustomStepper
