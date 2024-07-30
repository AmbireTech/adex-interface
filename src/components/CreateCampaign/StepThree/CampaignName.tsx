import { TextInput } from '@mantine/core'
import { ChangeEvent, FocusEventHandler } from 'react'

type CampaignNameProps = {
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: FocusEventHandler<HTMLInputElement>
  error: string
}

const CampaignName = ({ defaultValue, onChange, error, onFocus }: CampaignNameProps) => {
  return (
    <TextInput
      size="md"
      maw={{ sm: '100%', lg: '50%' }}
      placeholder="Campaign Name"
      name="title"
      defaultValue={defaultValue}
      onChange={(event) => onChange(event)}
      onFocus={onFocus}
      error={error && error}
    />
  )
}

export default CampaignName
