import { useMemo } from 'react'
import {
  SimpleGrid,
  Box
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
          { maxWidth: 'xl', cols: 2, spacing: 'md' },
          { maxWidth: 'md', cols: 1, spacing: 'md' }
        ]}
      >
        <AccountInfo accountData={accountData} />
        <AdminDeposit accountData={accountData} />
      </SimpleGrid>
      <SimpleGrid spacing="md" mt="md">
        <FundsActivity accountData={accountData} />
      </SimpleGrid>
    </Box>
  )
}

export { AccountDetails }
