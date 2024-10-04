import { useEffect, useMemo } from 'react'
import { SimpleGrid, Stack, Loader, Center, Fieldset, NumberFormatter } from '@mantine/core'
import useAdmin from 'hooks/useAdmin'
import { useParams } from 'react-router-dom'
import Dashboard from 'components/Dashboard'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import { FundsActivity } from './AccountDetailsElements'
import { AccountInfo } from './AccoutInfo'
import { AdminDeposit } from './AdminDeposit'

function AccountDetails() {
  const { accountId = '' } = useParams()
  const { accounts, initialDataLoading, getAllAccounts } = useAdmin()

  const accountData = useMemo(() => accounts.get(accountId), [accounts, accountId])

  const balance = useMemo(
    () =>
      accountData
        ? parseBigNumTokenAmountToDecimal(
            accountData?.availableBalance,
            accountData?.balanceToken.decimals
          )
        : 0,
    [accountData]
  )

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
    <Stack>
      <SimpleGrid cols={{ md: 1, xl: 2 }} spacing="xl">
        <Fieldset legend="Account address">{accountData.id}</Fieldset>
        <Fieldset legend="Account balance">
          <NumberFormatter suffix=" USDC" value={balance} thousandSeparator decimalScale={2} />
        </Fieldset>
      </SimpleGrid>
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
      <SimpleGrid spacing="xl">
        <Fieldset legend="Activity">
          <FundsActivity accountData={accountData} />
        </Fieldset>
      </SimpleGrid>
      <SimpleGrid spacing="xl">
        <Fieldset legend="Campaigns">
          <Dashboard isAdminPanel accountId={accountId} />
        </Fieldset>
      </SimpleGrid>
    </Stack>
  )
}

export { AccountDetails }
