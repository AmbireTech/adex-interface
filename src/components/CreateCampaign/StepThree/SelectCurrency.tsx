import { Image, Select, Text, Flex } from '@mantine/core'
import { formatCurrency } from 'helpers'
import { forwardRef, useState } from 'react'
import ethLogo from 'resources/logos/ethereumIcon.png'

const data = [
  {
    id: 1,
    symbol: 'ETH',
    icon: ethLogo,
    amount: 10000,
    network: 'Ethereum',
    value: 'ETH1'
  },
  {
    id: 2,
    symbol: 'ETH',
    icon: ethLogo,
    amount: 20000,
    network: 'Ethereum',
    value: 'ETH2'
  }
]

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: string
  symbol: string
  network: string
  amount: number
  value: string
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ icon, symbol, network, amount, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Flex justify="space-between">
        <Flex align="flex-start">
          <Image maw={20} mx="auto" radius="md" src={icon} alt={symbol} />
          <Text size="sm">
            {formatCurrency(amount, 2)} {symbol}
          </Text>
        </Flex>
        <Text size="sm">on {network}</Text>
      </Flex>
    </div>
  )
)

const SelectCurrency = () => {
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  return (
    <Select
      placeholder="Select currency"
      itemComponent={SelectItem}
      data={data}
      value={selectedItem || ''}
      onChange={(value) => setSelectedItem(value === null ? null : value)}
      maw="50%"
      maxDropdownHeight={400}
    />
  )
}

export default SelectCurrency
