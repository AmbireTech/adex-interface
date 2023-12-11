import { Grid, Text } from '@mantine/core'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import { useCallback, useMemo } from 'react'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { TargetingInputProps, TargetingInputSingle } from 'types'
import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

const DEFAULT_VALUE: TargetingInputSingle = {
  allIn: [],
  in: [],
  nin: []
}

const StepTwo = () => {
  const {
    campaign: {
      targetingInput: {
        inputs: { location, categories }
      }
    },
    updateCampaignWithPrevStateNested
  } = useCreateCampaignContext()

  const handleCategories = useCallback(
    (selectedRadio: TargetingInputProps, categoriesValue: string[]) => {
      const updated = { ...DEFAULT_VALUE }
      updated[selectedRadio] = categoriesValue

      updateCampaignWithPrevStateNested('targetingInput.inputs.categories', updated)
    },
    [updateCampaignWithPrevStateNested]
  )

  const handleCountries = useCallback(
    (selectedRadio: TargetingInputProps, locationsValue: string[]) => {
      const updated = { ...DEFAULT_VALUE }
      updated[selectedRadio] = locationsValue

      updateCampaignWithPrevStateNested('targetingInput.inputs.location', updated)
    },
    [updateCampaignWithPrevStateNested]
  )

  const catSelectedRadioAndValuesArray = useMemo(
    () => Object.entries(categories).find(([, value]) => Array.isArray(value) && value.length > 0),
    [categories]
  )

  const locSelectedRadioAndValuesArray = useMemo(
    () => Object.entries(location).find(([, value]) => Array.isArray(value) && value.length > 0),
    [location]
  )

  return (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          1. Categories
        </Text>
        <MultiSelectAndRadioButtons
          onCategoriesChange={handleCategories}
          multiSelectData={CATEGORIES}
          defaultRadioValue={
            catSelectedRadioAndValuesArray &&
            (catSelectedRadioAndValuesArray[0] as TargetingInputProps)
          }
          defaultSelectValue={catSelectedRadioAndValuesArray && catSelectedRadioAndValuesArray[1]}
          label="Categories"
        />
      </Grid.Col>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          2. Countries
        </Text>
        <MultiSelectAndRadioButtons
          onCategoriesChange={handleCountries}
          defaultRadioValue={
            locSelectedRadioAndValuesArray &&
            (locSelectedRadioAndValuesArray[0] as TargetingInputProps)
          }
          defaultSelectValue={locSelectedRadioAndValuesArray && locSelectedRadioAndValuesArray[1]}
          multiSelectData={COUNTRIES}
          label="Countries"
        />
      </Grid.Col>
    </Grid>
  )
}

export default StepTwo
