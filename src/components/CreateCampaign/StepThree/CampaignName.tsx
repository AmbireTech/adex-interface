import { TextInput } from '@mantine/core'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'

const CampaignName = () => {
  const form = useCreateCampaignFormContext()

  return <TextInput size="md" w="50%" {...form.getInputProps('campaignName')} />
}

export default CampaignName
