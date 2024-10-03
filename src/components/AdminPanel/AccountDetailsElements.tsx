import { useMemo } from 'react'
import { Account } from 'types'
import { Text, MantineColor } from '@mantine/core'

import CustomTable, { DataElement } from 'components/common/CustomTable'
import { parseBigNumTokenAmountToDecimal, toOperationEntry } from 'helpers'

export const FundsActivity = ({
  accountData,
  withShadow
}: {
  accountData: Account
  withShadow?: boolean
}) => {
  const elements = useMemo(() => {
    const data: DataElement[] = [
      ...accountData.fundsDeposited.deposits.map((x) => toOperationEntry('deposit', x)),
      ...accountData.fundsWithdrawn.withdrawals.map((x) => toOperationEntry('withdraw', x)),
      ...accountData.fundsOnCampaigns.perCampaign.map((x) => toOperationEntry('campaignOpen', x)),
      ...accountData.refundsFromCampaigns.perCampaign.map((x) =>
        toOperationEntry('campaignRefund', x)
      )
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      .map((x, i) => {
        const sign = x.type === 'campaignOpen' || x.type === 'withdraw' ? '-' : '+'
        const color: MantineColor = sign === '-' ? 'darkred' : 'darkgreen'
        return {
          id: x.id + i,
          columns: [
            {
              value: x.type,
              element: (
                <Text
                  c={color}
                  tt="capitalize"
                  fw="bold"
                  style={{ whiteSpace: 'nowrap' }}
                >{`${sign} ${x.name}`}</Text>
              )
            },
            { value: x.date.getTime(), element: x.date?.toLocaleDateString() || '' },
            {
              value: Number(x.amount),
              element: (
                <Text
                  c={color}
                  tt="capitalize"
                  fw="bold"
                  style={{ whiteSpace: 'nowrap' }}
                >{`${sign} ${parseBigNumTokenAmountToDecimal(x.amount, x.token.decimals)}`}</Text>
              )
            },

            { value: x.token.name },
            { value: x.id }
          ]
        }
      })

    // console.log({ data })

    return data
  }, [accountData])

  return (
    <CustomTable
      headings={['Type', 'Date', 'Amount', 'Token', 'Tx/Campaign id']}
      data={elements}
      defaultSortIndex={1}
      pageSize={10}
      shadow={withShadow ? 'xs' : undefined}
    />
  )
}
