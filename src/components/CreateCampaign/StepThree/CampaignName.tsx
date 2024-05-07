import { MediaQuery, TextInput, Text } from '@mantine/core'
import { ChangeEvent, FocusEventHandler } from 'react'

type CampaignNameProps = {
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: FocusEventHandler<HTMLInputElement>
  error: string
}

const CampaignName = ({ defaultValue, onChange, error, onFocus }: CampaignNameProps) => {
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
        onFocus={onFocus}
        error={error && <Text size="sm">{error}</Text>}
      />
    </MediaQuery>
  )
}

export default CampaignName
