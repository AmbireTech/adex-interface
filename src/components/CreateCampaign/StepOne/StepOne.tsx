import { Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import SelectDevice from './SelectDevice'
import UploadCreative from './UploadCreative'

const StepOne = () => {
  const {
    campaign: { devices }
  } = useCreateCampaignContext()

  return (
    <Grid>
      <Grid.Col>
        <SelectDevice />
      </Grid.Col>
      {devices.length > 0 && (
        <Grid.Col>
          <UploadCreative />
        </Grid.Col>
      )}
    </Grid>
  )
}

export default StepOne
