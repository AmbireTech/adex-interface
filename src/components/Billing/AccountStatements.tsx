import { useMemo } from 'react'
import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
// import { useDisclosure } from '@mantine/hooks'
// import { PrintModal } from 'components/common/Modals'
import useAccount from 'hooks/useAccount'
import { Deposit, CampaignFundsActive, CampaignRefunds } from 'types'

const columnTitles = ['Document', 'Date of issue']

type OperationEntry = (Deposit | CampaignFundsActive | CampaignRefunds) & {
  created: Date
  type: 'deposit' | 'campaign' | 'refund'
}

type ByMonth = {
  [x: string]: {
    operations: OperationEntry[]
  }
}

type WithBalances = {
  periodIndex: string
  operations: OperationEntry[]
  startBalance: bigint
  endBalance: bigint
}

const getMonthIndex = (date: Date): string => `${date.getUTCFullYear()}-${date.getUTCMonth()}`

const AccountStatements = () => {
  const {
    adexAccount: { fundsDeposited, fundsOnCampaigns, refundsFromCampaigns }
  } = useAccount()

  const statements = useMemo(() => {
    const deposits: OperationEntry[] = fundsDeposited.deposits.map((x) => ({
      ...x,
      amount: BigInt(x.amount),
      created: new Date(x.created),
      type: 'deposit'
    }))

    const campaigns: OperationEntry[] = fundsOnCampaigns.perCampaign.map((x) => ({
      ...x,
      amount: BigInt(x.amount),
      created: new Date(x.startDate),
      type: 'campaign'
    }))

    const refunds: OperationEntry[] = refundsFromCampaigns.perCampaign.map((x) => ({
      ...x,
      amount: BigInt(x.amount),
      created: new Date(x.closeDate),
      type: 'refund'
    }))

    const byMonths = [...deposits, ...campaigns, ...refunds]
      .sort((a, b) => a.created.getTime() - b.created.getTime())
      .reduce((months, current) => {
        const next = { ...months }
        const index = getMonthIndex(current.created)
        next[index] = next[index] || {}
        next[index].operations = [...(next[index].operations || []), current]

        return next
      }, {} as ByMonth)

    // TODO: group and sort by token
    const withBalances = Object.keys(byMonths)
      .sort()
      .map((key) => ({ periodIndex: key, ...byMonths[key] }))
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

        const currentPeriod = {
          ...current,
          startBalance,
          endBalance
        }

        nextAggr.push(currentPeriod)

        return nextAggr
      }, [] as WithBalances[])

    console.log(byMonths)
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
