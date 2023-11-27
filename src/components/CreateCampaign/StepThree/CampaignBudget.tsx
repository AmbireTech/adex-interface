import { Flex, NumberInput } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { useState } from 'react'

const CampaignBudget = () => {
  // TODO: Add checks and validations here
  const [errorToShow] = useState(false)

  return (
    <Flex justify="space-between" align="flex-start">
      <NumberInput
        hideControls
        size="md"
        w="50%"
        error={errorToShow}
        placeholder="Campaign Budget"
        description="Estimated fee: 0.15 DAI"
        inputWrapperOrder={['input', 'description', 'error']}
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
