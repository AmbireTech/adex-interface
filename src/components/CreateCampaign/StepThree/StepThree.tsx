import { Grid, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import CampaignPeriod from './CampaignPeriod'
import PaymentModel from './PaymentModel'
import SelectCurrency from './SelectCurrency'

const StepThree = () => {
  const {
    campaign: { step }
  } = useCreateCampaignContext()

  return step === 2 ? (
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
    </Grid>
  ) : null
}

export default StepThree
