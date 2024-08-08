import { useEffect, useMemo } from 'react'
import { SimpleGrid, Box, Title, Paper, Loader, Center } from '@mantine/core'
import useAdmin from 'hooks/useAdmin'
import { useParams } from 'react-router-dom'
import Dashboard from 'components/Dashboard'
import { FundsActivity } from './AccountDetailsElements'
import { AccountInfo } from './AccoutInfo'
import { AdminDeposit } from './AdminDeposit'

function AccountDetails() {
  const { accountId = '' } = useParams()
  const { accounts, initialDataLoading, getAllAccounts } = useAdmin()
  console.log({ accounts })
  const accountData = useMemo(() => accounts.get(accountId), [accounts, accountId])

  useEffect(() => {
    initialDataLoading && getAllAccounts()
  }, [getAllAccounts, initialDataLoading])

  if (initialDataLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    )
  }

  if (!accountData) {
    return <div>{`Invalid account id ${accountId}`}</div>
  }

  return (
    <Box>
      <SimpleGrid
        cols={{ md: 1, xl: 2 }}
        spacing="xl"
        // breakpoints={[
        //   { maxWidth: 'xl', cols: 2, spacing: 'xl' },
        //   { maxWidth: 'md', cols: 1, spacing: 'xl' }
        // ]}
      >
        <Paper p="sm" withBorder>
          <Title order={5} c="brand">
            Account info form
          </Title>
          <AccountInfo accountData={accountData} />
        </Paper>
        <Paper p="sm" withBorder>
          <Title order={5} c="brand">
            Deposit form
          </Title>
          <AdminDeposit accountData={accountData} />
        </Paper>
      </SimpleGrid>
      <SimpleGrid spacing="xl" mt="xl">
        <Paper p="sm" withBorder>
          <Title order={5} c="brand">
            Activity
          </Title>
          <FundsActivity accountData={accountData} />
        </Paper>
      </SimpleGrid>
      <SimpleGrid spacing="xl" mt="xl">
        <Paper p="sm" withBorder>
          <Title order={5} c="brand">
            Campaigns
          </Title>
          <Dashboard isAdminPanel accountId={accountId} />
        </Paper>
      </SimpleGrid>
    </Box>
  )
}

export { AccountDetails }
