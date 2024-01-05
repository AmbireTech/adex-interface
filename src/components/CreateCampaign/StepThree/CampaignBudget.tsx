import { Flex, TextInput } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'
import { useState } from 'react'

const CampaignBudget = () => {
  const [errorToShow] = useState(false)
  const form = useCreateCampaignFormContext()

  return (
    <Flex justify="space-between" align="flex-start">
      <TextInput
        size="md"
        w="50%"
        error={errorToShow}
        placeholder="Campaign Budget"
        description="Estimated fee: 0.15 DAI"
        inputWrapperOrder={['input', 'description', 'error']}
        {...form.getInputProps('campaignBudget')}
      />
      {errorToShow && (
        <InfoAlertMessage
          w="40%"
          message="You have insufficient funds in your account for launching a campaign. Top up your account from here. Your campaign has been automatically saved in drafts."
        />
      )}
    </Flex>
  )
}

export default CampaignBudget
