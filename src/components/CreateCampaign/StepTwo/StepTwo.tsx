import { Grid, Text } from '@mantine/core'
import { CATEGORIES, COUNTRIES } from 'constants/createCampaign'

import MultiSelectAndRadioButtons from './MultiSelectAndRadioButtons'

const StepTwo = () => (
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
)

export default StepTwo
