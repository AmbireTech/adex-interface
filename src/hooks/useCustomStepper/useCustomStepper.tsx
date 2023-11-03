import { useCallback, useState } from 'react'
import { UseCustomStepperProps } from 'types'

const useCustomStepper = ({ stepsCount }: UseCustomStepperProps) => {
  const [activeStep, setActiveStep] = useState(0)

  const nextStep = useCallback(() => {
    setActiveStep((prevStep) => (prevStep < stepsCount ? prevStep + 1 : prevStep))
  }, [stepsCount])

  const previousStep = useCallback(() => {
    setActiveStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep))
  }, [])

  return {
    activeStep,
    nextStep,
    previousStep
  }
}

export default useCustomStepper
