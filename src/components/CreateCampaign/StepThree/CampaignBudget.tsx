import { Flex, MediaQuery, TextInput, Text } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import { MIN_CAMPAIGN_BUDGET_VALUE } from 'helpers/validators'
import useAccount from 'hooks/useAccount'
import { ChangeEvent, FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react'

type CampaignBudgetProps = {
  defaultValue: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: FocusEventHandler<HTMLInputElement>
  error: string
}

const CampaignBudget = ({ defaultValue, onChange, onFocus, error }: CampaignBudgetProps) => {
  const [err, setErr] = useState(error)
  const [value, setValue] = useState('')
  const {
    adexAccount: { availableBalance, balanceToken }
  } = useAccount()

  const formattedToken = useMemo(
    () => Number(parseBigNumTokenAmountToDecimal(availableBalance, balanceToken.decimals)),
    [availableBalance, balanceToken.decimals]
  )

  const handleOnChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.value)
      onChange(event)
    },
    [onChange]
  )

  const budgetIsGreaterThanBalance = useMemo(
    () => formattedToken < Number(value),
    [formattedToken, value]
  )

  useEffect(() => {
    let currentError
    if (value !== '' && Number(value) < MIN_CAMPAIGN_BUDGET_VALUE) {
      currentError = `Campaign budget can not be lower than ${MIN_CAMPAIGN_BUDGET_VALUE}`
    } else {
      currentError = ''
    }
    setErr(currentError)
  }, [value, defaultValue])

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
          // TODO: Should get/calculate estimated fee
          // description={`Estimated fee: 0.15 ${balanceToken.name}`}
          inputWrapperOrder={['input', 'description', 'error']}
          defaultValue={defaultValue}
          name="campaignBudget"
          onChange={(event) => handleOnChange(event)}
          onFocus={onFocus}
          error={err && <Text size="sm">{err}</Text>}
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
