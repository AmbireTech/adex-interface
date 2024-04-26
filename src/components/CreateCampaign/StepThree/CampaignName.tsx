import { MediaQuery, TextInput, Text } from '@mantine/core'
import { ChangeEvent } from 'react'

type CampaignNameProps = {
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error: string
}

const CampaignName = ({ defaultValue, onChange, error }: CampaignNameProps) => {
  return (
    <MediaQuery
      smallerThan="lg"
      styles={{
        maxWidth: '100%'
      }}
    >
      <TextInput
        size="md"
        maw="50%"
        placeholder="Campaign Name"
        name="title"
        defaultValue={defaultValue}
        onChange={(event) => onChange(event)}
        error={error && <Text size="sm">{error}</Text>}
      />
    </MediaQuery>
  )
}

export default CampaignName
