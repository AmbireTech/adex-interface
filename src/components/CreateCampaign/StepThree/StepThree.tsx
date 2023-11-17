import { Grid, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import CampaignPeriod from './CampaignPeriod'

const StepThree = () => {
  const {
    campaign: { step }
  } = useCreateCampaignContext()

  return step === 2 ? (
    <Grid>
      <Grid.Col>
        <Text color="secondaryText" size="sm" weight="bold" mb="xs">
          1. Campaign Period
        </Text>
        <CampaignPeriod />
      </Grid.Col>
    </Grid>
  ) : null
}

export default StepThree
