import { Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import SelectDevice from './SelectDevice'
import UploadCreative from './UploadCreative'

const StepOne = () => {
  const {
    campaign: { step }
  } = useCreateCampaignContext()

  return step === 0 ? (
    <Grid>
      <Grid.Col>
        <SelectDevice />
      </Grid.Col>
      <Grid.Col>
        <UploadCreative />
      </Grid.Col>
    </Grid>
  ) : null
}

export default StepOne
