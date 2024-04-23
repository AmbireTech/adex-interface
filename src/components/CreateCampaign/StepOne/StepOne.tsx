import { Grid } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import SelectDevice from './SelectDevice'
import UploadCreative from './UploadCreative'
import SelectPlacements from './SelectPlacements'

const StepOne = () => {
  const {
    campaign: {
      devices,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    }
  } = useCreateCampaignContext()

  return (
    <Grid>
      <Grid.Col>
        <SelectPlacements />
      </Grid.Col>
      {placement === 'site' && (
        <Grid.Col>
          <SelectDevice />
        </Grid.Col>
      )}
      {devices.length > 0 && (
        <Grid.Col>
          <UploadCreative />
        </Grid.Col>
      )}
    </Grid>
  )
}

export default StepOne
