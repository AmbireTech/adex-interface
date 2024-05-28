import { useMemo } from 'react'
import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
// import { useDisclosure } from '@mantine/hooks'
// import { PrintModal } from 'components/common/Modals'
import useAccount from 'hooks/useAccount'
import { Deposit, CampaignFundsActive, CampaignRefunds } from 'types'

const columnTitles = ['Document', 'Date of issue']

type OperationEntry = (Deposit | CampaignFundsActive | CampaignRefunds) & {
  date: Date
  type: 'deposit' | 'campaign' | 'refund'
}

type ByPeriodAndToken = {
  [index: string]: {
    operations: OperationEntry[]
  }
}

type WithBalances = {
  periodIndex: string
  tokenIndex: string
  operations: OperationEntry[]
  startBalance: bigint
  endBalance: bigint
}

const getPeriodIndex = (date: Date): string => `${date.getUTCFullYear()}-${date.getUTCMonth()}`
const getTokenIndex = (token: OperationEntry['token']): string =>
  `${token.chainId}-${token.address}`

const toOpEntry = (
  x: Deposit | CampaignFundsActive | CampaignRefunds,
  type: OperationEntry['type']
): OperationEntry => {
  // TODO: type
  // @ts-ignore
  const date: Date = new Date(x.created || x.startDate || x.closeDate)

  console.log({ date })

  return {
    ...x,
    amount: BigInt(x.amount),
    date,
    type
  }
}

const AccountStatements = () => {
  const {
    adexAccount: { fundsDeposited, fundsOnCampaigns, refundsFromCampaigns }
  } = useAccount()

  const statements = useMemo(() => {
    const deposits: OperationEntry[] = fundsDeposited.deposits.map((x) => toOpEntry(x, 'deposit'))

    const campaigns: OperationEntry[] = fundsOnCampaigns.perCampaign.map((x) =>
      toOpEntry(x, 'campaign')
    )

    const refunds: OperationEntry[] = refundsFromCampaigns.perCampaign.map((x) =>
      toOpEntry(x, 'refund')
    )

    const currentPeriodIndex = getPeriodIndex(new Date())

    const byPeriodAndToken = [...deposits, ...campaigns, ...refunds]
      // NOTE: statements only for fully ended periods
      .filter((x) => getPeriodIndex(x.date) < currentPeriodIndex)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .reduce((months, current) => {
        const next = { ...months }
        const { date, token } = current
        const index = `${getPeriodIndex(date)}.${getTokenIndex(token)}`
        next[index] = next[index] || {}
        next[index].operations = [...(next[index].operations || []), current]

        return next
      }, {} as ByPeriodAndToken)

    const withBalances = Object.keys(byPeriodAndToken)
      .sort()
      .map((key) => {
        const indexSplit = key.split('.')
        return { periodIndex: indexSplit[0], tokenIndex: indexSplit[1], ...byPeriodAndToken[key] }
      })
      .reduce((balances, current, index) => {
        const nextAggr = [...balances]
        let startBalance: bigint = BigInt(0)
        if (index > 0) {
          startBalance = nextAggr[index - 1].endBalance
        }

        const endBalance = current.operations.reduce((bal, el) => {
          let nextBal = bal

          if (el.type === 'campaign') {
            nextBal -= el.amount
          } else {
            nextBal += el.amount
          }

          return nextBal
        }, startBalance)

        const currentStatemet = {
          ...current,
          startBalance,
          endBalance
        }

        nextAggr.push(currentStatemet)

        return nextAggr
      }, [] as WithBalances[])

    console.log(byPeriodAndToken)
    console.log(withBalances)

    return []
  }, [fundsDeposited, fundsOnCampaigns, refundsFromCampaigns])

  if (!statements) {
    return <Title order={4}>No AccountStatements found.</Title>
  }

  return (
    <>
      {/* Temporary disabled */}
      {/* <PrintModal opened={opened} close={close} /> */}
      <CustomTable headings={columnTitles} elements={statements} />
    </>
  )
}

export default AccountStatements
