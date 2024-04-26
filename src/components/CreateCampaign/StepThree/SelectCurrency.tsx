import { Image, Select, Text, Flex, MediaQuery } from '@mantine/core'
import { DIGITS_AFTER_FLOATING_POINT } from 'constants/balances'
import { formatCurrency } from 'helpers'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import useAccount from 'hooks/useAccount'
import { getTokenIcon, networks } from 'lib/Icons'
import { ChangeEvent, forwardRef, useCallback, useMemo } from 'react'
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
  error: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ address, chainId, name, availableBalance, decimals, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Flex justify="space-between">
        <Flex align="flex-start">
          <Image maw={20} mx="auto" radius="md" src={getTokenIcon(chainId, address)} alt={name} />
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
)

const SelectCurrency = ({ defaultValue, onChange, error }: SelectCurrencyProps) => {
  const {
    adexAccount: {
      availableBalance,
      balanceToken
      // fundsDeposited: { deposits }
    }
  } = useAccount()

  const mappedDeposits: ItemProps[] = useMemo(
    () =>
      Array({ availableBalance, ...balanceToken }).map((item) => ({
        ...item,
        value: item.name,
        label: item.name
      })),
    [availableBalance, balanceToken]
  )

  const handleSelectChange = useCallback(
    (value: string | null) => {
      const event = {
        target: {
          value: value ? value.toString() : null,
          name: 'currency'
        }
      } as ChangeEvent<HTMLInputElement>

      onChange(event)
    },
    [onChange]
  )

  return (
    <MediaQuery
      smallerThan="lg"
      styles={{
        maxWidth: '100%'
      }}
    >
      <Select
        placeholder="Select currency"
        itemComponent={SelectItem}
        data={mappedDeposits}
        defaultValue={defaultValue}
        onChange={(event) => handleSelectChange(event)}
        maw="50%"
        maxDropdownHeight={400}
        error={error && <Text size="sm">{error}</Text>}
      />
    </MediaQuery>
  )
}

export default SelectCurrency
