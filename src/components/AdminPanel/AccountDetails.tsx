import { useCallback, useMemo, useState } from 'react'
import { useForm, isInRange, hasLength, matches } from '@mantine/form'
import { Button, Group, TextInput, Box, NumberInput, Grid, Accordion } from '@mantine/core'
import useAdmin from 'hooks/useAdmin'
import throttle from 'lodash.throttle'
import { useParams } from 'react-router-dom'
import { FundsActivity } from './AccountDetailsElements'

type Deposit = {
  accountId: string
  amount: number
  token: {
    name: string
    chainId: number
    address: string
    decimals: number
  }
  txHash: string
}

function AccountDetails() {
  const { accountId = '' } = useParams()
  const { makeDeposit, accounts, initialDataLoading } = useAdmin()
  const [loading, setLoading] = useState(false)
  const accountData = useMemo(() => accounts.get(accountId), [accounts, accountId])

  console.log({ accountId })

  const form = useForm<Deposit>({
    initialValues: {
      accountId,
      amount: 0,
      token: {
        name: 'USDC',
        chainId: 137,
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        decimals: 6
      },
      txHash: ''
    },

    validate: {
      accountId: matches(/^(0x)?[0-9a-fA-F]{40}$/, 'invalid account address'),
      amount: isInRange({ min: 10, max: 1000000000000 }, 'min 10'),
      token: {
        name: hasLength({ min: 1 }),
        chainId: isInRange({ min: 0, max: 999999 }),
        address: matches(/^(0x)?[0-9a-fA-F]{40}$/, 'invalid token address'),
        decimals: isInRange({ min: 1, max: 18 })
      },
      txHash: matches(/^0x([A-Fa-f0-9]{64})$/, 'invalid tx hash')
    }
  })

  const handleSubmit = useCallback(
    async (values: Deposit) => {
      setLoading(true)
      await makeDeposit(values, () => {
        form.reset()
        form.resetTouched()
        form.resetDirty()
      })

      setLoading(false)
    },
    [form, makeDeposit]
  )

  const throttledSbm = useMemo(() => {
    return throttle(handleSubmit, 3000, { leading: true })
  }, [handleSubmit])

  if (!accountData || initialDataLoading) {
    return <div>{`Invalid account id ${accountId}`}</div>
  }

  return (
    <Grid>
      <Grid.Col span={6}>{accountData.info?.contactPerson}</Grid.Col>
      <Grid.Col span={6}>
        <Accordion defaultValue="deposit-form">
          <Accordion.Item value="deposit-form">
            <Accordion.Control>Deposit form</Accordion.Control>
            <Accordion.Panel>
              <Box component="form" maw={400} mx="auto" onSubmit={form.onSubmit(throttledSbm)}>
                <TextInput
                  label="Account address"
                  placeholder="0x000"
                  withAsterisk
                  {...form.getInputProps('accountId')}
                  disabled
                />
                <NumberInput
                  mt="sm"
                  label="Amount"
                  type="number"
                  placeholder="Amount"
                  hideControls
                  min={0}
                  {...form.getInputProps('amount')}
                />
                <TextInput
                  label="Token name"
                  placeholder="Token name"
                  withAsterisk
                  disabled
                  mt="md"
                  {...form.getInputProps('token.name')}
                />
                <TextInput
                  label="Token addr"
                  placeholder="Token addr"
                  withAsterisk
                  disabled
                  mt="md"
                  {...form.getInputProps('token.address')}
                />
                <TextInput
                  label="Token chain id"
                  placeholder="Token chain id"
                  withAsterisk
                  disabled
                  mt="md"
                  {...form.getInputProps('token.chainId')}
                />
                <NumberInput
                  label="Token decimals"
                  placeholder="token decimals"
                  withAsterisk
                  disabled
                  mt="md"
                  {...form.getInputProps('token.decimals')}
                />
                <TextInput
                  label="Tx hash"
                  placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
                  withAsterisk
                  mt="md"
                  {...form.getInputProps('txHash')}
                />

                <Group position="right" mt="md">
                  <Button type="submit" disabled={loading}>
                    Submit
                  </Button>
                </Group>
              </Box>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Grid.Col>
      <Grid.Col span={12}>
        <FundsActivity accountData={accountData} />
      </Grid.Col>
    </Grid>
  )
}

export { AccountDetails }
