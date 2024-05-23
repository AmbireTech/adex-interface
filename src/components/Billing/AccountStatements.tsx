import { useMemo } from 'react'
import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
// import { useDisclosure } from '@mantine/hooks'
// import { PrintModal } from 'components/common/Modals'
import useAccount from 'hooks/useAccount'

const columnTitles = ['Document', 'Date of issue']

type ByMonth = {
  [x: string]: any
}

const getMonthIndex = (date: Date): string => `${date.getUTCFullYear()}-${date.getUTCMonth()}`

const AccountStatements = () => {
  const {
    adexAccount: { fundsDeposited, fundsOnCampaigns, refundsFromCampaigns }
  } = useAccount()

  const statements = useMemo(() => {
    const deposits = fundsDeposited.deposits.map((x) => ({
      created: new Date(x.created),
      type: 'deposit'
    }))

    const campaigns = fundsOnCampaigns.perCampaign.map((x) => ({
      created: new Date(x.startDate),
      type: 'campaign'
    }))

    const refunds = refundsFromCampaigns.perCampaign.map((x) => ({
      created: new Date(x.closeDate),
      type: 'refund'
    }))

    const byMonths = [...deposits, ...campaigns, ...refunds]
      .sort((a, b) => a.created.getTime() - b.created.getTime())
      .reduce((months, current) => {
        const next = { ...months }
        const index = getMonthIndex(current.created)
        next[index] = next[index] || {}
        next[index].operations[current.created.getTime().toString()] = current

        return next
      }, {} as ByMonth)

    console.log(byMonths)

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
