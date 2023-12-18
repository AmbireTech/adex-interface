import { Grid, Text } from '@mantine/core'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'
import { useCallback, useMemo } from 'react'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext' // import { TargetingInputProps, TargetingInputSingle } from 'types'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import {
  findArrayWithLengthInObjectAsValue,
  updateCatsLocsObject
} from 'helpers/createCampaignHelpers'
import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

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
    (selectedRadio: TargetingInputApplyProp, categoriesValue: string[]) => {
      updateCampaignWithPrevStateNested(
        'targetingInput.inputs.categories',
        updateCatsLocsObject(selectedRadio, categoriesValue)
      )
    },
    [updateCampaignWithPrevStateNested]
  )

  const handleCountries = useCallback(
    (selectedRadio: TargetingInputApplyProp, locationsValue: string[]) => {
      updateCampaignWithPrevStateNested(
        'targetingInput.inputs.location',
        updateCatsLocsObject(selectedRadio, locationsValue)
      )
    },
    [updateCampaignWithPrevStateNested]
  )

  const catSelectedRadioAndValuesArray = useMemo(
    () => findArrayWithLengthInObjectAsValue(categories),
    [categories]
  )

  const locSelectedRadioAndValuesArray = useMemo(
    () => findArrayWithLengthInObjectAsValue(location),
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
            (catSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
          }
          defaultSelectValue={
            catSelectedRadioAndValuesArray && (catSelectedRadioAndValuesArray[1] as string[])
          }
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
            (locSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
          }
          defaultSelectValue={
            locSelectedRadioAndValuesArray && (locSelectedRadioAndValuesArray[1] as string[])
          }
          multiSelectData={COUNTRIES}
          label="Countries"
        />
      </Grid.Col>
    </Grid>
  )
}

export default StepTwo
