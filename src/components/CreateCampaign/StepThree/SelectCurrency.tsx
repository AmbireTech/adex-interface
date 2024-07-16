import { Image, Text, Flex, useCombobox, Combobox, InputBase, Input } from '@mantine/core'
import { DIGITS_AFTER_FLOATING_POINT } from 'constants/balances'
import { formatCurrency } from 'helpers'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import useAccount from 'hooks/useAccount'
import { getTokenIcon, networks } from 'lib/Icons'
import { ChangeEvent, FocusEventHandler, useCallback, useMemo, useState } from 'react'
import { Token } from 'types'

type ItemProps = Token &
  React.ComponentPropsWithoutRef<'div'> & {
    availableBalance: bigint
    label: string
    value: string
  }

type SelectCurrencyProps = {
  defaultValue: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: FocusEventHandler<HTMLInputElement>
  error: string
}

const SelectOption = ({
  address,
  chainId,
  name,
  availableBalance,
  decimals,
  ...others
}: ItemProps) => (
  <div {...others}>
    <Flex justify="space-between">
      <Flex align="flex-start">
        <Image maw={20} mr="xs" radius="md" src={getTokenIcon(chainId, address)} alt={name} />
        <Text size="sm">
          {formatCurrency(
            Number(parseBigNumTokenAmountToDecimal(availableBalance, decimals)),
            DIGITS_AFTER_FLOATING_POINT
          )}{' '}
          {name}
        </Text>
      </Flex>
      <Text size="sm">on {networks[chainId]}</Text>
    </Flex>
  </div>
)

const SelectCurrency = ({ defaultValue, onChange, onFocus, error }: SelectCurrencyProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const {
    adexAccount: {
      availableBalance,
      balanceToken
      // fundsDeposited: { deposits }
    }
  } = useAccount()
  const [value, setValue] = useState<string | null>(defaultValue || null)

  const mappedDeposits: ItemProps[] = useMemo(
    () =>
      Array({ availableBalance, ...balanceToken }).map((item) => ({
        ...item,
        value: item.name,
        label: item.name
      })),
    [availableBalance, balanceToken]
  )
  const selectedOption = useMemo(
    () => mappedDeposits.find((item) => item.value === value),
    [value, mappedDeposits]
  )

  const handleOptionSubmit = useCallback(
    (val: string) => {
      if (val !== value) {
        const event = {
          target: {
            value: val ? val.toString() : null,
            name: 'currency'
          }
        } as ChangeEvent<HTMLInputElement>

        onChange(event)
      }

      setValue(val)
      combobox.closeDropdown()
    },
    [combobox, setValue, onChange, value]
  )
  // TODO: remove it and fix onFocus
  console.log(onFocus)

  const options = mappedDeposits.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ))

  return (
    <Combobox
      store={combobox}
      // focusTarget={onFocus}
      withinPortal={false}
      onOptionSubmit={handleOptionSubmit}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
          maw="50%"
          size="md"
          error={error && <Text size="sm">{error}</Text>}
        >
          {selectedOption ? (
            <SelectOption {...selectedOption} />
          ) : (
            <Input.Placeholder>Select Currency</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default SelectCurrency
