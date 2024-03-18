import { Image, Select, Text, Flex, MediaQuery } from '@mantine/core'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'
import { formatCurrency } from 'helpers'
import { forwardRef } from 'react'
import ethLogo from 'resources/logos/ethereumIcon.png'

const data = [
  {
    id: 1,
    symbol: 'ETH',
    icon: ethLogo,
    amount: 10000,
    network: 'Ethereum',
    value: 'ETH1',
    label: 'ETH'
  },
  {
    id: 2,
    symbol: 'ETH',
    icon: ethLogo,
    amount: 20000,
    network: 'Ethereum',
    value: 'ETH2',
    label: 'ETH'
  }
]

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  icon: string
  symbol: string
  network: string
  amount: number
  value: string
  label: string
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
  const form = useCreateCampaignFormContext()
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
        data={data}
        {...form.getInputProps('currency')}
        maw="50%"
        maxDropdownHeight={400}
      />
    </MediaQuery>
  )
}

export default SelectCurrency
