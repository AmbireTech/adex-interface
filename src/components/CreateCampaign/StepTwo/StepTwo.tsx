import { Grid, Text } from '@mantine/core'
import { CATEGORIES, CAT_GROUPS, COUNTRIES, REGION_GROUPS } from 'constants/createCampaign'
import { useCallback } from 'react'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

const CATEGORIES_PATH = 'targetingInput.inputs.categories'
const LOCATION_PATH = 'targetingInput.inputs.location'

const StepTwo = () => {
  const {
    campaign: {
      targetingInput: {
        inputs: {
          location,
          categories,
          categories: { apply: categoriesRadioValue },
          location: { apply: locationRadioValue }
        }
      }
    },
    form: { setFieldValue, errors }
  } = useCreateCampaignContext()

  const handleSelect = useCallback(
    (selectedRadio: TargetingInputApplyProp, values: string[], path: string) => {
      setFieldValue(path, {
        apply: selectedRadio,
        in: selectedRadio === 'in' ? values : [],
        nin: selectedRadio === 'nin' ? values : []
      })
    },
    [setFieldValue]
  )

  return (
    <Grid>
      <Grid.Col>
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          1. Categories
        </Text>
        <MultiSelectAndRadioButtons
          onCategoriesChange={(selectedRadio, values) =>
            handleSelect(selectedRadio, values, CATEGORIES_PATH)
          }
          multiSelectData={CATEGORIES}
          defaultRadioValue={categoriesRadioValue}
          defaultSelectValue={
            categoriesRadioValue !== 'all' ? categories[categoriesRadioValue] : []
          }
          groups={CAT_GROUPS}
          label="Categories"
          error={errors[CATEGORIES_PATH]?.toString()}
        />
      </Grid.Col>
      <Grid.Col>
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          2. Countries
        </Text>
        <MultiSelectAndRadioButtons
          onCategoriesChange={(selectedRadio, values) =>
            handleSelect(selectedRadio, values, LOCATION_PATH)
          }
          defaultRadioValue={locationRadioValue}
          defaultSelectValue={locationRadioValue !== 'all' ? location[locationRadioValue] : []}
          multiSelectData={COUNTRIES}
          groups={REGION_GROUPS}
          label="Countries"
          error={errors[LOCATION_PATH]?.toString()}
        />
      </Grid.Col>
    </Grid>
  )
}

export default StepTwo
