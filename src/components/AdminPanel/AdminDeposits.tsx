import { useCallback, useMemo, useState } from 'react'
import { useForm, isInRange, hasLength, matches } from '@mantine/form'
import { Button, Group, TextInput, Box, NumberInput } from '@mantine/core'
import { useAdExApi } from 'hooks/useAdexServices'
import throttle from 'lodash.throttle'

type Deposit = {
  account: string
  amount: number
  token: {
    name: string
    chainId: number
    address: string
    decimals: number
  }
  txHash: string
}

function AdminDeposit() {
  const { adexServicesRequest } = useAdExApi()
  const [loading, setLoading] = useState(false)

  const form = useForm<Deposit>({
    initialValues: {
      account: '',
      amount: 0,
      token: {
        name: 'USDC',
        chainId: 137,
        address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        decimals: 6
      },
      txHash: '0x0000000000000000000000000000000000000000000000000000000000000000'
    },

    validate: {
      account: matches(/^(0x)?[0-9a-fA-F]{40}$/, 'invalid account address'),
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
    (values: Deposit) => {
      const submit = async () => {
        console.log({ values })
        const { account, ...body } = values
        body.amount *= 10 ** body.token.decimals
        console.log({ body })

        try {
          const res = await adexServicesRequest('backend', {
            route: `/dsp/admin/accounts/${account}/deposit`,
            method: 'POST',
            body,
            headers: {
              'content-type': 'application/json'
            }
          })

          console.log({ res })

          form.reset()
          form.resetTouched()
          form.resetDirty()
        } catch (err) {
          console.log({ err })
        }
        setLoading(false)
      }

      submit()
    },
    [adexServicesRequest, form]
  )

  const throttledSbm = useMemo(() => {
    return throttle(handleSubmit, 3000, { leading: true })
  }, [handleSubmit])

  return (
    <Box component="form" maw={400} mx="auto" onSubmit={form.onSubmit(throttledSbm)}>
      <TextInput
        label="Account address"
        placeholder="0x000"
        withAsterisk
        {...form.getInputProps('account')}
      />
      <NumberInput
        mt="sm"
        label="Amount"
        // type="number"
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
        placeholder="tx hash"
        withAsterisk
        mt="md"
        {...form.getInputProps('txHash')}
      />

      <Group justify="right" mt="md">
        <Button type="submit" disabled={loading}>
          Submit
        </Button>
      </Group>
    </Box>
  )
}

export { AdminDeposit }
