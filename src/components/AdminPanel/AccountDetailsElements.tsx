import { useMemo } from 'react'
import { Account } from 'types'
import { Box, Text, MantineColor } from '@mantine/core'

import CustomTable, { DataElement } from 'components/common/CustomTable'
import { parseBigNumTokenAmountToDecimal, toOperationEntry } from 'helpers'

export const FundsActivity = ({ accountData }: { accountData: Account }) => {
  const elements = useMemo(() => {
    const data: DataElement[] = [
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
          id: x.name,
          columns: [
            { element: <Text c={color} tt="capitalize" fw="bold">{`${sign} ${x.name}`}</Text> },
            { value: x.date?.toLocaleDateString() || '' },
            {
              element: (
                <Text
                  c={color}
                  tt="capitalize"
                  fw="bold"
                >{`${sign} ${parseBigNumTokenAmountToDecimal(x.amount, x.token.decimals)}`}</Text>
              )
            },

            { value: x.token.name },
            { value: x.id }
          ]
        }
      })

    console.log({ data })

    return data
  }, [accountData])

  return (
    <Box>
      <CustomTable
        headings={['Type', 'Date', 'Amount', 'Token', 'Tx/Campaign id']}
        data={elements}
        pageSize={10}
      />
    </Box>
  )
}
