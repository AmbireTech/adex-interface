import { Group, Radio, Text } from '@mantine/core'
import { ChangeEvent, useCallback } from 'react'

type PaymentModelProps = {
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  error: string
}

const PaymentModel = ({ defaultValue, onChange, error }: PaymentModelProps) => {
  const handleSelectChange = useCallback(
    (value: string | null) => {
      const event = {
        target: {
          value: value ? value.toString() : null,
          name: 'paymentModel'
        }
      } as ChangeEvent<HTMLInputElement>

      onChange(event)
    },
    [onChange]
  )
  return (
    <Radio.Group
      defaultValue={defaultValue}
      onChange={(value) => handleSelectChange(value)}
      error={error && <Text size="sm">{error}</Text>}
    >
      <Group mt="xs">
        <Radio value="cpm" label="CPM" />
        {/* Disabled at the moment */}
        {/* <Radio value="cpc" label="CPC" /> */}
      </Group>
    </Radio.Group>
  )
}

export default PaymentModel
