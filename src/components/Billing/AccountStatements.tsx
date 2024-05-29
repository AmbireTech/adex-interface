import { useMemo, useCallback, useState, SetStateAction } from 'react'
import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import useAccount from 'hooks/useAccount'
import { Deposit, CampaignFundsActive, CampaignRefunds, OperationEntry, StatementData } from 'types'
import { ADEX_COMPANY_DETAILS } from 'constants/adexCompanyDetatils'
import { BillingDetailsModal } from './BillingDetailsModal'
import { StatementsPDF } from './BillingPDF'

const columnTitles = ['Date of issue', 'Token']

type ByPeriodAndToken = {
  [index: string]: {
    operations: OperationEntry[]
  }
}

const getPeriodIndex = (date: Date): string => `${date.getUTCFullYear()}-${date.getUTCMonth()}`
const periodIndexToDate = (index: string): Date => {
  const split = index.split('-')
  return new Date(Number(split[0]), Number(split[1]))
}
const getTokenIndex = (token: OperationEntry['token']): string =>
  `${token.chainId}-${token.address}`

const toOpEntry = (
  x: Deposit | CampaignFundsActive | CampaignRefunds,
  type: OperationEntry['type']
): OperationEntry => {
  // TODO: type
  // @ts-ignore
  const date: Date = new Date(x.created || x.startDate || x.closeDate)

  return {
    ...x,
    amount: BigInt(x.amount),
    date,
    type
  }
}

const AccountStatements = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const {
    adexAccount: { address, billingDetails, fundsDeposited, fundsOnCampaigns, refundsFromCampaigns }
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
      }, [] as StatementData[])

    console.log(byPeriodAndToken)
    console.log(withBalances)

    return withBalances
  }, [fundsDeposited, fundsOnCampaigns, refundsFromCampaigns])

  const [stIndex, setStIndex] = useState(0)

  const statement = useMemo(() => {
    return statements?.[stIndex] || null
  }, [statements, stIndex])

  const elements = useMemo(() => {
    return statements.map((st, index) => ({
      id: index,
      date: periodIndexToDate(st.periodIndex).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short'
      }),
      token: st.operations[0].token.name
    }))
  }, [statements])

  const onPreview = useCallback(
    (el: { id: SetStateAction<number> }) => {
      setStIndex(el.id)
      open()
    },
    [open]
  )

  if (!statements) {
    return <Title order={4}>No AccountStatements found.</Title>
  }

  return (
    <>
      <BillingDetailsModal title="Statement" loading={!statement} opened={opened} close={close}>
        {statement && (
          <StatementsPDF
            statement={statement}
            seller={ADEX_COMPANY_DETAILS}
            buyer={{ ...billingDetails, ethAddress: address }}
          />
        )}
      </BillingDetailsModal>
      <CustomTable headings={columnTitles} elements={elements} onPreview={onPreview} />
    </>
  )
}

export default AccountStatements
