import { ChangeEvent, useMemo } from 'react'
import useAccount from 'hooks/useAccount'
import CustomCombobox from 'components/CustomCombobox'

type SelectCurrencyProps = {
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  error: string
}

const SelectCurrency = ({ defaultValue, onChange, onFocus, error }: SelectCurrencyProps) => {
  const {
    adexAccount: { availableBalance, balanceToken }
  } = useAccount()

  const mappedDeposits = useMemo(() => {
    return Array({ availableBalance, ...balanceToken }).map((item) => ({
      ...item,
      value: item.name,
      label: item.name
    }))
  }, [availableBalance, balanceToken])

  return (
    <CustomCombobox
      items={mappedDeposits}
      defaultValue={defaultValue}
      onChange={onChange}
      onFocus={onFocus}
      error={error}
      placeholder="Select Currency"
      maw={{ sm: '100%', lg: '50%' }}
    />
  )
}

export default SelectCurrency
