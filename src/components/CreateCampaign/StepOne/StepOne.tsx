import { Stack } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
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
    },
    form: { errors }
  } = useCreateCampaignContext()

  console.log({ errors })

  return (
    <Stack>
      <SelectPlacements />
      {placement === 'site' && <SelectDevice />}
      {(placement === 'app' || devices.length > 0) && <UploadCreative />}
      {errors['targetingInput.inputs.placements'] && (
        <InfoAlertMessage message={errors['targetingInput.inputs.placements'].toString() || ''} />
      )}
    </Stack>
  )
}

export default StepOne
