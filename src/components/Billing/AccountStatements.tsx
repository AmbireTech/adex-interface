import { useMemo, useCallback } from 'react'
import { Title, Button, Flex, Group, Loader, Modal, createStyles } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import useAccount from 'hooks/useAccount'
import { Deposit, CampaignFundsActive, CampaignRefunds, OperationEntry, StatementData } from 'types'

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

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '1px solid',
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    padding: theme.spacing.lg
  },
  header: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: theme.spacing.xl
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[theme.fn.primaryShade()]
  },
  printable: {
    [theme.other.media.print]: {
      // NOTE: it's not fixed/absolute to body but modal.inner
      overflow: 'visible',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '100%',
      padding: theme.spacing.xl
    }
  }
}))

type ModalProps = {
  statement: StatementData
  opened: boolean
  close: () => void
}

const StatementModal = ({ statement, opened, close }: ModalProps) => {
  const { classes } = useStyles()
  return (
    <Modal
      title="Invoice"
      size="xl"
      opened={opened}
      onClose={close}
      centered
      radius="sm"
      classNames={{
        header: classes.header,
        title: classes.title,
        close: classes.close
      }}
    >
      <div>
        {!statement ? (
          <Flex justify="center" align="center" h="60vh">
            <Loader size="xl" />
          </Flex>
        ) : (
          <>
            <Group position="right">
              <Button mt="md" mb="md" onClick={() => window.print()}>
                Print
              </Button>
            </Group>

            <div className={classes.wrapper}>
              <div id="printable" className={classes.printable} />
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

const AccountStatements = () => {
  const [opened, { open, close }] = useDisclosure(false)
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
      }, [] as StatementData[])

    console.log(byPeriodAndToken)
    console.log(withBalances)

    return withBalances
  }, [fundsDeposited, fundsOnCampaigns, refundsFromCampaigns])

  const elements = useMemo(() => {
    return statements.map((st) => ({
      id: `${st.periodIndex}.${st.tokenIndex}`,
      date: periodIndexToDate(st.periodIndex).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short'
      }),
      token: st.operations[0].token.name
    }))
  }, [statements])

  const onPreview = useCallback(() => {
    open()
  }, [open])

  if (!statements) {
    return <Title order={4}>No AccountStatements found.</Title>
  }

  return (
    <>
      {/* Temporary disabled */}
      <StatementModal statement={statements[0]} opened={opened} close={close} />
      <CustomTable headings={columnTitles} elements={elements} onPreview={onPreview} />
    </>
  )
}

export default AccountStatements
