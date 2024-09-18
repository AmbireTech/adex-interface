import { useMemo, useCallback, useState, SetStateAction } from 'react'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import useAccount from 'hooks/useAccount'
import { OperationEntry, StatementData } from 'types'
import { ADEX_COMPANY_DETAILS } from 'constants/adexCompanyDetatils'
import {
  getMonthRangeString,
  monthPeriodIndex,
  monthPeriodIndexToDate,
  toOperationEntry
} from 'helpers'
import VisibilityIcon from 'resources/icons/Visibility'
import { BillingDetailsModal } from './BillingDetailsModal'
import { StatementsPDF } from './BillingPDF'

const columnTitles = ['Date of issue', 'Currency / Token']

type ByPeriodAndToken = {
  [periodIndex: string]: {
    operations: OperationEntry[]
  }
}

const getTokenIndex = (token: OperationEntry['token']): string =>
  `${token.chainId}-${token.address}`

const Statements = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const {
    isLoading,
    adexAccount: { address, billingDetails, fundsDeposited, fundsOnCampaigns, refundsFromCampaigns }
  } = useAccount()

  const statements = useMemo(() => {
    const deposits: OperationEntry[] = fundsDeposited.deposits.map((x) =>
      toOperationEntry('deposit', x)
    )

    const campaigns: OperationEntry[] = fundsOnCampaigns.perCampaign.map((x) =>
      toOperationEntry('campaignOpen', x)
    )

    const refunds: OperationEntry[] = refundsFromCampaigns.perCampaign.map((x) =>
      toOperationEntry('campaignRefund', x)
    )

    const currentPeriodIndex = monthPeriodIndex(new Date())

    const byPeriodAndToken = [...deposits, ...campaigns, ...refunds]
      // NOTE: statements only for fully ended periods
      .filter((x) => monthPeriodIndex(x.date) < currentPeriodIndex)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .reduce((months, current) => {
        const next = { ...months }
        const { date, token } = current
        const index = `${monthPeriodIndex(date)}.${getTokenIndex(token)}`
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

          if (el.type === 'campaignOpen') {
            nextBal -= el.amount
          } else {
            nextBal += el.amount
          }

          return nextBal
        }, startBalance)

        const currentStatemet = {
          ...current,
          token: current.operations[0].token,
          startBalance,
          endBalance
        }

        nextAggr.push(currentStatemet)

        return nextAggr
      }, [] as StatementData[])

    return withBalances
  }, [fundsDeposited, fundsOnCampaigns, refundsFromCampaigns])

  const [stIndex, setStIndex] = useState(0)

  const statement = useMemo(() => {
    return statements?.[stIndex] || null
  }, [statements, stIndex])

  const elements = useMemo(() => {
    return statements
      .map((st, index) => ({
        id: index.toString(),
        columns: [
          {
            value: st.periodIndex,
            element: getMonthRangeString(monthPeriodIndexToDate(st.periodIndex))
          },
          { value: st.operations[0].token.name }
        ]
      }))
      .reverse()
  }, [statements])

  const onPreview = useCallback(
    (el: { id: SetStateAction<number> }) => {
      setStIndex(el.id)
      open()
    },
    [open]
  )

  const actions = useMemo(() => {
    return [
      {
        action: onPreview,
        label: 'View statement',
        icon: <VisibilityIcon />
      }
    ]
  }, [onPreview])

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
      <CustomTable
        headings={columnTitles}
        data={elements}
        actions={actions}
        shadow="xs"
        loading={isLoading}
      />
    </>
  )
}

export default Statements
