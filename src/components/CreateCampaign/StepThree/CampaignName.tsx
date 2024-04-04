import { MediaQuery, TextInput } from '@mantine/core'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'

const CampaignName = () => {
  const form = useCreateCampaignFormContext()

  return (
    <MediaQuery
      smallerThan="lg"
      styles={{
        maxWidth: '100%'
      }}
    >
      <TextInput size="md" maw="50%" {...form.getInputProps('title')} />
    </MediaQuery>
  )
}

export default CampaignName
