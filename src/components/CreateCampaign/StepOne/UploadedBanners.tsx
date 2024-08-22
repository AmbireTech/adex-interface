import { Checkbox, Stack } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit } from 'adex-common/dist/types'
import ImageUrlInput from './ImageUrlInput'
import { UtmInfo } from '../CreateCampaignCommon'

const UploadedBanners = () => {
  const {
    campaign: {
      adUnits,
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    form,
    removeAdUnit
  } = useCreateCampaignContext()

  return adUnits.length > 0 ? (
    <Stack align="stretch" justify="center">
      <Checkbox
        label={<UtmInfo title="Auto UTM tracking *" placement={placement} />}
        key={form.key('autoUTMChecked')}
        {...form.getInputProps('autoUTMChecked', { type: 'checkbox' })}
      />

      {adUnits.map((image: AdUnit, index: number) => {
        return <ImageUrlInput image={image} onDelete={removeAdUnit} index={index} form={form} />
      })}
    </Stack>
  ) : null
}

export default UploadedBanners
