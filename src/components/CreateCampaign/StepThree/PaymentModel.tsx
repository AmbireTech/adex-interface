import { useCallback } from 'react'
import { Group, Radio } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { PaymentModelType } from 'types'

const PaymentModel = () => {
  const {
    updateCampaign,
    campaign: { paymentModel }
  } = useCreateCampaignContext()

  const handleRadioChange = useCallback(
    (value: PaymentModelType) => updateCampaign('paymentModel', value),
    [updateCampaign]
  )

  return (
    <Radio.Group value={paymentModel} onChange={handleRadioChange}>
      <Group mt="xs">
        <Radio value="cpm" label="CPM" />
        {/* Disabled at the moment */}
        {/* <Radio value="cpc" label="CPC" /> */}
      </Group>
    </Radio.Group>
  )
}

export default PaymentModel
