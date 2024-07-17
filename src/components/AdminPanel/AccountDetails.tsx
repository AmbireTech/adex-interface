import { useMemo } from 'react'
import {
  SimpleGrid,
  Box,
  Title
  // Accordion
} from '@mantine/core'
import useAdmin from 'hooks/useAdmin'
import { useParams } from 'react-router-dom'
import { FundsActivity } from './AccountDetailsElements'
import { AccountInfo } from './AccoutInfo'
import { AdminDeposit } from './AdminDeposit'

function AccountDetails() {
  const { accountId = '' } = useParams()
  const { accounts, initialDataLoading } = useAdmin()
  const accountData = useMemo(() => accounts.get(accountId), [accounts, accountId])

  if (!accountData || initialDataLoading) {
    return <div>{`Invalid account id ${accountId}`}</div>
  }

  return (
    <Box>
      <SimpleGrid
        cols={2}
        breakpoints={[
          { maxWidth: 'xl', cols: 2, spacing: 'xl' },
          { maxWidth: 'md', cols: 1, spacing: 'xl' }
        ]}
      >
        <Box>
          <Title order={5} color="brand">
            Account info form
          </Title>
          <AccountInfo accountData={accountData} />
        </Box>
        <Box>
          <Title order={5} color="brand">
            Deposit form
          </Title>
          <AdminDeposit accountData={accountData} />
        </Box>
      </SimpleGrid>
      <SimpleGrid spacing="xl" mt="xl">
        <Box>
          <Title order={5} color="brand">
            Account activity
          </Title>
          <FundsActivity accountData={accountData} />
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export { AccountDetails }
