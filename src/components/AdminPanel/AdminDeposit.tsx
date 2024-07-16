import { isInRange, hasLength, matches, useForm } from '@mantine/form'
import { useCallback, useMemo, useState } from 'react'
import { Button, Group, TextInput, Box, NumberInput } from '@mantine/core'
import useAdmin from 'hooks/useAdmin'
import throttle from 'lodash.throttle'
import { Account } from 'types'
import useCustomNotifications from 'hooks/useCustomNotifications'

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

function AdminDeposit({ accountData }: { accountData: Account }) {
  const { showNotification } = useCustomNotifications()
  const { makeDeposit } = useAdmin()
  const [loading, setLoading] = useState(false)

  const form = useForm<Deposit>({
    initialValues: {
      accountId: accountData.id,
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
      await makeDeposit(
        values,
        () => {
          form.resetTouched()
          form.resetDirty()
          form.reset()
          showNotification('info', `Deposit to ${form.values.accountId} success!`)
        },
        (err) => {
          showNotification('error', err, `Error depositing to ${form.values.accountId}`)
        }
      )

      setLoading(false)
    },
    [form, makeDeposit, showNotification]
  )

  const throttledSbm = useMemo(() => {
    return throttle(handleSubmit, 3000, { leading: true })
  }, [handleSubmit])

  return (
    <Box component="form" onSubmit={form.onSubmit(throttledSbm)}>
      <TextInput
        label="Account address"
        placeholder="0x000"
        withAsterisk
        {...form.getInputProps('accountId')}
        disabled
      />
      <Group mt="sm" position="left" align="baseline">
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
          {...form.getInputProps('token.name')}
        />
        <TextInput
          label="Token addr"
          placeholder="Token addr"
          withAsterisk
          disabled
          {...form.getInputProps('token.address')}
        />
        <TextInput
          label="Token chain id"
          placeholder="Token chain id"
          withAsterisk
          disabled
          {...form.getInputProps('token.chainId')}
        />
        <NumberInput
          label="Token decimals"
          placeholder="token decimals"
          withAsterisk
          disabled
          {...form.getInputProps('token.decimals')}
        />
        <TextInput
          label="Tx hash"
          placeholder="0x0000000000000000000000000000000000000000000000000000000000000000"
          withAsterisk
          {...form.getInputProps('txHash')}
        />
      </Group>

      <Group position="left" mt="md">
        <Button type="submit" loading={loading} disabled={loading || !form.isDirty()}>
          Make deposit
        </Button>
      </Group>
    </Box>
  )
}

export { AdminDeposit }
