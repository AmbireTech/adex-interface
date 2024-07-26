import { Flex, MediaQuery, TextInput, Text } from '@mantine/core'
import InfoAlertMessage from 'components/common/InfoAlertMessage'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import { MIN_CAMPAIGN_BUDGET_VALUE, MIN_CAMPAIGN_BUDGET_VALUE_ADMIN } from 'helpers/validators'
import useAccount from 'hooks/useAccount'
import { ChangeEvent, FocusEventHandler, useCallback, useEffect, useMemo, useState } from 'react'

type CampaignBudgetProps = {
  defaultValue: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: FocusEventHandler<HTMLInputElement>
  error: string
  isAdmin: boolean
}

const CampaignBudget = ({
  defaultValue,
  onChange,
  onFocus,
  error,
  isAdmin
}: CampaignBudgetProps) => {
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
    const minBudget = isAdmin ? MIN_CAMPAIGN_BUDGET_VALUE_ADMIN : MIN_CAMPAIGN_BUDGET_VALUE
    if (value !== '' && Number(value) < minBudget) {
      currentError = `Campaign budget can not be lower than ${minBudget}`
    } else {
      currentError = ''
    }
    setErr(currentError)
  }, [value, defaultValue, isAdmin])

  // TODO: fix the entire form validation and flow - it's not acceptable at the moment
  // NOTE: tem fix to show err on "next step" when there is no value for budget
  useEffect(() => {
    setErr(error)
  }, [error])

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
