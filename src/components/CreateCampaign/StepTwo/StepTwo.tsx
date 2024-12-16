import { Divider, Stack, Text } from '@mantine/core'
import { CATEGORIES, CAT_GROUPS, COUNTRIES, REGION_GROUPS, SSPs } from 'constants/createCampaign'
import { useCallback } from 'react'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import useAccount from 'hooks/useAccount'
import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

const CATEGORIES_PATH = 'targetingInput.inputs.categories'
const LOCATION_PATH = 'targetingInput.inputs.location'
const SSPS_PATH = 'targetingInput.inputs.ssp'

const StepTwo = () => {
  const {
    campaign: {
      targetingInput: {
        inputs: {
          location,
          categories,
          categories: { apply: categoriesRadioValue },
          location: { apply: locationRadioValue },
          ssp
        }
      }
    },
    form: { setFieldValue, errors }
  } = useCreateCampaignContext()

  const { isAdmin } = useAccount()

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
    <Stack>
      <Text c="secondaryText" size="sm" fw="bold">
        1. Categories
      </Text>
      <MultiSelectAndRadioButtons
        onCategoriesChange={(selectedRadio, values) =>
          handleSelect(selectedRadio, values, CATEGORIES_PATH)
        }
        multiSelectData={CATEGORIES}
        defaultRadioValue={categoriesRadioValue}
        defaultSelectValue={categoriesRadioValue !== 'all' ? categories[categoriesRadioValue] : []}
        groups={CAT_GROUPS}
        label="Categories"
        error={errors[CATEGORIES_PATH]?.toString()}
      />
      <Divider m="xl" variant="dashed" />
      <Text c="secondaryText" size="sm" fw="bold">
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
      {isAdmin && (
        <div>
          <Divider m="xl" variant="dashed" mt="xl" />
          <Text c="secondaryText" size="sm" fw="bold">
            3. SSPs
          </Text>
          <MultiSelectAndRadioButtons
            onCategoriesChange={(selectedRadio, values) =>
              handleSelect(selectedRadio, values, SSPS_PATH)
            }
            groups={{}}
            defaultRadioValue={ssp?.apply}
            defaultSelectValue={ssp?.apply !== 'all' ? ssp?.[ssp.apply] : []}
            multiSelectData={SSPs}
            label="SSPs"
            error={errors[SSPS_PATH]?.toString()}
          />
        </div>
      )}
    </Stack>
  )
}

export default StepTwo
