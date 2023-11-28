import { Grid, Text } from '@mantine/core'
import CampaignPeriod from './CampaignPeriod'
import PaymentModel from './PaymentModel'
import SelectCurrency from './SelectCurrency'
import CampaignBudget from './CampaignBudget'
import CpmMinMax from './CpmMinMax'
import CampaignName from './CampaignName'

const StepThree = () => (
  <Grid>
    <Grid.Col mb="md">
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        1. Campaign Period
      </Text>
      <CampaignPeriod />
    </Grid.Col>
    <Grid.Col mb="md">
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        2. Payment Model
      </Text>
      <PaymentModel />
    </Grid.Col>
    <Grid.Col mb="md">
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        3. Currency
      </Text>
      <SelectCurrency />
    </Grid.Col>
    <Grid.Col mb="md">
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        4. Campaign Budget
      </Text>
      <CampaignBudget />
    </Grid.Col>
    <Grid.Col mb="md">
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        5. CPM
      </Text>
      <CpmMinMax />
    </Grid.Col>
    <Grid.Col mb="md">
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        6. Campaign Name
      </Text>
      <CampaignName />
    </Grid.Col>
  </Grid>
)

export default StepThree
