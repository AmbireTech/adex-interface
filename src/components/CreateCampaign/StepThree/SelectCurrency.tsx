import { ReactNode, useMemo } from 'react'
import useAccount from 'hooks/useAccount'
import CustomCombobox from 'components/CustomCombobox'

type SelectCurrencyProps = {
  defaultValue: string | undefined
  onChange: (val: string) => void
  error: string | ReactNode
}

const SelectCurrency = ({ defaultValue, onChange, error }: SelectCurrencyProps) => {
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
      error={error}
      placeholder="Select Currency"
      maw={{ sm: '100%', lg: '50%' }}
    />
  )
}

export default SelectCurrency
