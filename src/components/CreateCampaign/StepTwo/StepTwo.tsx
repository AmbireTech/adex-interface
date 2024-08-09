import { Grid, Text } from '@mantine/core'
import { CATEGORIES, CAT_GROUPS, COUNTRIES, REGION_GROUPS } from 'constants/createCampaign'
import { useCallback, useMemo } from 'react'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import {
  findArrayWithLengthInObjectAsValue,
  updateCatsLocsObject
} from 'helpers/createCampaignHelpers'
import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

type SelectedTypes = 'categories' | 'location'

const StepTwo = () => {
  const {
    campaign: {
      targetingInput,
      targetingInput: {
        inputs: { location, categories }
      }
    },
    updateCampaign
  } = useCreateCampaignContext()

  const handleSelect = useCallback(
    (selectedRadio: TargetingInputApplyProp, values: string[], type: SelectedTypes) => {
      const updated = {
        ...targetingInput,
        inputs: {
          ...targetingInput.inputs,
          [type]: updateCatsLocsObject(selectedRadio, values)
        }
      }

      updateCampaign({ targetingInput: updated })
    },
    [updateCampaign, targetingInput]
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
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          1. Categories
        </Text>
        <MultiSelectAndRadioButtons
          onCategoriesChange={(selectedRadio, values) =>
            handleSelect(selectedRadio, values, 'categories')
          }
          multiSelectData={CATEGORIES}
          defaultRadioValue={
            catSelectedRadioAndValuesArray &&
            (catSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
          }
          defaultSelectValue={
            catSelectedRadioAndValuesArray && (catSelectedRadioAndValuesArray[1] as string[])
          }
          groups={CAT_GROUPS}
          label="Categories"
        />
      </Grid.Col>
      <Grid.Col>
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          2. Countries
        </Text>
        <MultiSelectAndRadioButtons
          onCategoriesChange={(selectedRadio, values) =>
            handleSelect(selectedRadio, values, 'location')
          }
          defaultRadioValue={
            locSelectedRadioAndValuesArray &&
            (locSelectedRadioAndValuesArray[0] as TargetingInputApplyProp)
          }
          defaultSelectValue={
            locSelectedRadioAndValuesArray && (locSelectedRadioAndValuesArray[1] as string[])
          }
          multiSelectData={COUNTRIES}
          groups={REGION_GROUPS}
          label="Countries"
        />
      </Grid.Col>
    </Grid>
  )
}

export default StepTwo
