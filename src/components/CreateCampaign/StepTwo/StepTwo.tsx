import { Grid, Text } from '@mantine/core'
import {
  CAMPAIGN_CATEGORIES_INPUT,
  CAMPAIGN_LOCATION_INPUT,
  CATEGORIES,
  CAT_GROUPS,
  COUNTRIES,
  REGION_GROUPS
} from 'constants/createCampaign'
import { useCallback, useMemo } from 'react'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
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
        CAMPAIGN_CATEGORIES_INPUT,
        updateCatsLocsObject(selectedRadio, categoriesValue)
      )
    },
    [updateCampaignWithPrevStateNested]
  )

  const handleCountries = useCallback(
    (selectedRadio: TargetingInputApplyProp, locationsValue: string[]) => {
      updateCampaignWithPrevStateNested(
        CAMPAIGN_LOCATION_INPUT,
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
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
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
          groups={CAT_GROUPS}
          label="Categories"
        />
      </Grid.Col>
      <Grid.Col>
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
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
          groups={REGION_GROUPS}
          label="Countries"
        />
      </Grid.Col>
    </Grid>
  )
}

export default StepTwo
