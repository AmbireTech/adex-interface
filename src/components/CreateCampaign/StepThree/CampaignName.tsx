import { TextInput } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'

const CampaignName = () => {
  const {
    campaign: { title },
    updateCampaign
  } = useCreateCampaignContext()

  return (
    <TextInput
      value={title}
      onChange={(e) => updateCampaign('title', e.target.value)}
      size="md"
      w="50%"
    />
  )
}

export default CampaignName
