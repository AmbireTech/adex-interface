import { useMemo } from 'react'
import { Account, ICustomTableProps } from 'types'
import { Box, Text, MantineColor } from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import { parseBigNumTokenAmountToDecimal, toOperationEntry } from 'helpers'

export const FundsActivity = ({ accountData }: { accountData: Account }) => {
  const elements = useMemo(() => {
    const data: ICustomTableProps['elements'] = [
      ...accountData.fundsDeposited.deposits.map((x) => toOperationEntry('deposit', x)),
      ...accountData.fundsOnCampaigns.perCampaign.map((x) => toOperationEntry('campaignOpen', x)),
      ...accountData.refundsFromCampaigns.perCampaign.map((x) =>
        toOperationEntry('campaignRefund', x)
      )
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      .map((x) => {
        const sign = x.type === 'campaignOpen' ? '-' : '+'
        const color: MantineColor = sign === '-' ? 'darkred' : 'darkgreen'
        return {
          name: (
            <Text color={color} transform="capitalize" weight="bold">{`${sign} ${x.name}`}</Text>
          ),
          date: x.date?.toLocaleDateString() || '',
          amount: (
            <Text
              color={color}
              transform="capitalize"
              weight="bold"
            >{`${sign} ${parseBigNumTokenAmountToDecimal(x.amount, x.token.decimals)}`}</Text>
          ),

          token: x.token.name,
          actionId: x.id
        }
      })

    console.log({ data })

    return data
  }, [accountData])

  return (
    <Box>
      <CustomTable
        background
        headings={['Type', 'Date', 'Amount', 'Token', 'Tx/Campaign id']}
        elements={elements}
        pageSize={10}
      />
    </Box>
  )
}
