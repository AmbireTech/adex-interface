import { useMemo } from 'react'
import { Account } from 'types'
import { Box, Text } from '@mantine/core'

import CustomTable from 'components/common/CustomTable'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

export const FundsActivity = ({ accountData }: { accountData: Account }) => {
  const elements = useMemo(() => {
    const data = accountData.fundsDeposited.deposits
      .sort((a, b) => Number(b.created) - Number(a.created))
      .map((x) => {
        return {
          id: x.created?.toString() || '',
          date: new Date(x.created).toLocaleDateString(),
          amount: parseBigNumTokenAmountToDecimal(x.amount, x.token.decimals),
          token: x.token.name,
          txHash: x.txHash
        }
      })

    console.log({ data })

    return data
  }, [accountData])

  return (
    <Box>
      <Text />
      <CustomTable
        background
        headings={['Date', 'Amount', 'Token', 'Tx hash']}
        elements={elements}
        pageSize={10}
      />
    </Box>
  )
}
