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
    removeAdUnit,
    getInputProps,
    key
  } = useCreateCampaignContext()

  return (
    <Stack align="stretch" justify="center">
      <Checkbox
        label={<UtmInfo title="Auto UTM tracking *" placement={placement} />}
        key={key('autoUTMChecked')}
        {...getInputProps('autoUTMChecked', { type: 'checkbox' })}
      />

      {adUnits.length > 0 &&
        adUnits.map((image: AdUnit, index: number) => {
          return <ImageUrlInput image={image} onDelete={removeAdUnit} index={index} form={form} />
        })}
    </Stack>
  )
}

export default UploadedBanners
