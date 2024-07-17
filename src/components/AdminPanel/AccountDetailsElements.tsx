import { useMemo } from 'react'
import { Account, Token, CampaignFundsActive, CampaignRefunds, Deposit } from 'types'
import { Box } from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

type ActivityElementType = 'deposit' | 'campaignOpen' | 'campaignRefund'

type ActivityElement = {
  id: string
  type: ActivityElementType
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

  switch (type) {
    case 'deposit':
      date = (el as Deposit).created
      id = (el as Deposit).txHash
      break
    case 'campaignOpen':
      date = (el as CampaignFundsActive).startDate
      id = (el as CampaignFundsActive).id
      break
    case 'campaignRefund':
      date = (el as CampaignRefunds).closeDate
      id = (el as CampaignRefunds).id
      break
    default:
      break
  }

  date = new Date(date)

  const ae: ActivityElement = {
    id: id || date.getTime().toString(),
    type,
    amount: el.amount,
    token: el.token,
    date
  }

  return ae
}

export const FundsActivity = ({ accountData }: { accountData: Account }) => {
  const elements = useMemo(() => {
    const data = [
      ...accountData.fundsDeposited.deposits.map((x) => toActivityEntry('deposit', x)),
      ...accountData.fundsOnCampaigns.perCampaign.map((x) => toActivityEntry('campaignOpen', x)),
      ...accountData.refundsFromCampaigns.perCampaign.map((x) =>
        toActivityEntry('campaignRefund', x)
      )
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      .map((x) => {
        const sign = x.type === 'campaignOpen' ? '-' : '+'
        return {
          type: `${sign} ${x.type}`,
          date: x.date?.toLocaleDateString() || '',
          amount: `${sign} ${parseBigNumTokenAmountToDecimal(x.amount, x.token.decimals)}`,
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
