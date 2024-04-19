import { Flex, MediaQuery, TextInput } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import useAccount from 'hooks/useAccount'
import { useMemo } from 'react'

const CampaignBudget = () => {
  const form = useCreateCampaignFormContext()
  const {
    adexAccount: { availableBalance, balanceToken }
  } = useAccount()

  const formattedToken = useMemo(
    () => Number(parseBigNumTokenAmountToDecimal(availableBalance, balanceToken.decimals)),
    [availableBalance, balanceToken.decimals]
  )
  const budgetInput = useMemo(() => form.getInputProps('campaignBudget').value, [form])
  const budgetIsGreaterThanBalance = useMemo(
    () => formattedToken < Number(budgetInput),
    [formattedToken, budgetInput]
  )
  return (
    <Flex justify="space-between" align="flex-start">
      <MediaQuery
        smallerThan="lg"
        styles={{
          maxWidth: '100%'
        }}
      >
        <TextInput
          size="md"
          maw="50%"
          placeholder="Campaign Budget"
          description="Estimated fee: 0.15 DAI"
          inputWrapperOrder={['input', 'description', 'error']}
          {...form.getInputProps('campaignBudget')}
        />
      </MediaQuery>
      {budgetIsGreaterThanBalance && (
        <InfoAlertMessage
          w="40%"
          message="You have insufficient funds in your account for launching a campaign. Top up your account from here. Your campaign has been automatically saved in drafts."
        />
      )}
    </Flex>
  )
}

export default CampaignBudget
