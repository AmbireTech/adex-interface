import { Grid } from '@mantine/core'
import SelectDevice from './SelectDevice'
import UploadCreative from './UploadCreative'

const StepOne = () => (
  <Grid>
    <Grid.Col>
      <SelectDevice />
    </Grid.Col>
    <Grid.Col>
      <UploadCreative />
    </Grid.Col>
  </Grid>
)

export default StepOne
