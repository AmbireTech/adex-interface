import { useEffect, useMemo } from 'react'
import { SimpleGrid, Box, Loader, Center, Fieldset } from '@mantine/core'
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
        <Fieldset legend="Account info form">
          <AccountInfo accountData={accountData} />
        </Fieldset>
        <Fieldset legend="Transfers form">
          <AdminDeposit accountData={accountData} />
        </Fieldset>
      </SimpleGrid>
      <SimpleGrid spacing="xl" mt="xl">
        <Fieldset legend="Activity">
          <FundsActivity accountData={accountData} />
        </Fieldset>
      </SimpleGrid>
      <SimpleGrid spacing="xl" mt="xl">
        <Fieldset legend="Campaigns">
          <Dashboard isAdminPanel accountId={accountId} />
        </Fieldset>
      </SimpleGrid>
    </Box>
  )
}

export { AccountDetails }
