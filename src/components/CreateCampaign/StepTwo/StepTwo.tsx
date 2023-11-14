import { Grid, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'

import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

const StepTwo = () => {
  const {
    campaign: { step }
  } = useCreateCampaignContext()

  return step === 1 ? (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          1. Categories
        </Text>
        <MultiSelectAndRadioButtons multiSelectData={CATEGORIES} label="Categories" />
      </Grid.Col>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          2. Countries
        </Text>
        <MultiSelectAndRadioButtons multiSelectData={COUNTRIES} label="Countries" />
      </Grid.Col>
    </Grid>
  ) : null
}
export default StepTwo
