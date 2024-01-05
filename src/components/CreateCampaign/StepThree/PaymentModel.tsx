import { Group, Radio } from '@mantine/core'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'

const PaymentModel = () => {
  const form = useCreateCampaignFormContext()

  return (
    <Radio.Group {...form.getInputProps('paymentModel')}>
      <Group mt="xs">
        <Radio value="cpm" label="CPM" />
        {/* Disabled at the moment */}
        {/* <Radio value="cpc" label="CPC" /> */}
      </Group>
    </Radio.Group>
  )
}

export default PaymentModel
