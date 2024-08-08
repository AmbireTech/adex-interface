import {
  Combobox,
  ComboboxProps,
  InputBase,
  Text,
  Flex,
  Image,
  useCombobox,
  Input,
  InputBaseProps
} from '@mantine/core'
import { DIGITS_AFTER_FLOATING_POINT } from 'constants/balances'
import { formatCurrency } from 'helpers'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import { getTokenIcon, networks } from 'lib/Icons'
import { ReactNode, useCallback, useMemo, useState } from 'react'

type CustomComboboxProps = ComboboxProps &
  InputBaseProps & {
    items: ItemProps[]
    defaultValue: string | undefined
    onChange: (val: string) => void
    error?: string | ReactNode
    placeholder: string
  }

type ItemProps = {
  address?: string
  chainId?: number
  name?: string
  availableBalance?: bigint
  decimals?: number
  value: string
  label: string
  image?: ReactNode
}

const SelectOption = ({
  address,
  chainId,
  name,
  availableBalance,
  decimals,
  image,
  label,
  ...others
}: ItemProps) => (
  <div {...others}>
    <Flex justify="space-between">
      <Flex align="center">
        {chainId && address && (
          <Image maw={20} mr="xs" radius="md" src={getTokenIcon(chainId, address)} alt={name} />
        )}
        {image && image}
        <Text size="sm">
          {availableBalance !== undefined && decimals !== undefined
            ? `${formatCurrency(
                Number(parseBigNumTokenAmountToDecimal(availableBalance, decimals)),
                DIGITS_AFTER_FLOATING_POINT
              )} ${name}`
            : label}
        </Text>
      </Flex>
      {chainId !== undefined && <Text size="sm">on {networks[chainId]}</Text>}
    </Flex>
  </div>
)

const CustomCombobox = ({
  items,
  defaultValue,
  onChange,
  // onFocus,
  error,
  placeholder,
  ...props
}: CustomComboboxProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption()
  })

  const [value, setValue] = useState<string | null>(defaultValue || null)

  const selectedOption = useMemo(() => items.find((item) => item.value === value), [value, items])

  const handleOptionSubmit = useCallback(
    (val: string) => {
      onChange(val)
      setValue(val)
      combobox.closeDropdown()
    },
    [combobox, setValue, onChange]
  )

  const options = items.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
      <SelectOption {...item} />
    </Combobox.Option>
  ))

  const handleBtnOnClicked = useCallback(() => {
    combobox.toggleDropdown()
  }, [combobox])

  return (
    <Combobox store={combobox} withinPortal={false} onOptionSubmit={handleOptionSubmit} {...props}>
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={handleBtnOnClicked}
          rightSectionPointerEvents="none"
          maw={props.maw}
          size="md"
          error={error || null}
        >
          {selectedOption ? (
            <SelectOption {...selectedOption} />
          ) : (
            <Input.Placeholder>{placeholder}</Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}

export default CustomCombobox
