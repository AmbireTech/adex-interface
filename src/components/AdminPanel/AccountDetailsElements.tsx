import { useMemo } from 'react'
import {
  Account,
  Token,
  CampaignFundsActive,
  CampaignRefunds,
  Deposit,
  ICustomTableProps
} from 'types'
import { Box, Text, MantineColor } from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

type ActivityElementType = 'deposit' | 'campaignOpen' | 'campaignRefund'

type ActivityElement = {
  id: string
  type: ActivityElementType
  name: string
  date: Date
  amount: bigint
  token: Token
}

const toActivityEntry = (
  type: ActivityElementType,
  el: CampaignFundsActive | CampaignRefunds | Deposit
) => {
  let date = new Date()
  let id = ''
  let name: string = type

  switch (type) {
    case 'deposit':
      date = (el as Deposit).created
      id = (el as Deposit).txHash
      break
    case 'campaignOpen':
      date = (el as CampaignFundsActive).startDate
      id = (el as CampaignFundsActive).id
      name = 'campaign open'
      break
    case 'campaignRefund':
      date = (el as CampaignRefunds).closeDate
      id = (el as CampaignRefunds).id
      name = 'refund from campaign'
      break
    default:
      break
  }

  date = new Date(date)

  const ae: ActivityElement = {
    id: id || date.getTime().toString(),
    name,
    type,
    amount: el.amount,
    token: el.token,
    date
  }

  return ae
}

export const FundsActivity = ({ accountData }: { accountData: Account }) => {
  const elements = useMemo(() => {
    const data: ICustomTableProps['elements'] = [
      ...accountData.fundsDeposited.deposits.map((x) => toActivityEntry('deposit', x)),
      ...accountData.fundsOnCampaigns.perCampaign.map((x) => toActivityEntry('campaignOpen', x)),
      ...accountData.refundsFromCampaigns.perCampaign.map((x) =>
        toActivityEntry('campaignRefund', x)
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
