import { isInRange, hasLength, matches, useForm } from '@mantine/form'
import { useCallback, useMemo, useState, FormEvent } from 'react'
import {
  Button,
  Group,
  TextInput,
  Box,
  NumberInput,
  Stack,
  SegmentedControl,
  Center,
  ThemeIcon,
  MantineColor
} from '@mantine/core'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
import { modals } from '@mantine/modals'
import useAdmin from 'hooks/useAdmin'
import throttle from 'lodash.throttle'
import { Account, AdminTransfer, AdminTransferType } from 'types'
import useCustomNotifications from 'hooks/useCustomNotifications'
import DepositIcon from 'resources/icons/Deposit'
import WithdrawIcon from 'resources/icons/Withdraw'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

const transferTypeLabels: { [key in AdminTransferType]: { label: string; color: MantineColor } } = {
  deposit: { label: 'deposit', color: 'success' },
  credit: { label: 'refund', color: 'warning' }
}

function AdminDeposit({ accountData }: { accountData: Account }) {
  const { showNotification } = useCustomNotifications()
  const { makeTransfer, getAllAccounts } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [transferType, setTransferType] = useState<AdminTransferType>('deposit')
  const balance = useMemo(
    () =>
      parseBigNumTokenAmountToDecimal(
        accountData.availableBalance,
        accountData.balanceToken.decimals
      ),
    [accountData.availableBalance, accountData.balanceToken.decimals]
  )

  const form = useForm<AdminTransfer>({
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
      amount:
        transferType === 'deposit'
          ? isInRange({ min: 10, max: 100_000_000 }, 'min: 10, max: 100k')
          : isInRange(
              {
                min: 1,
                max: balance
              },
              `min: 1, max: balance ${balance}`
            ),
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
    async (values: AdminTransfer) => {
      setLoading(true)
      await makeTransfer(
        values,
        transferType,
        () => {
          getAllAccounts()
          form.reset()
          showNotification('info', `Deposit to ${form.values.accountId} success!`)
        },
        (err) => {
          showNotification('error', err, `Error depositing to ${form.values.accountId}`)
        }
      )

      setLoading(false)
    },
    [makeTransfer, transferType, getAllAccounts, form, showNotification]
  )

  const throttledSbm = useMemo(
    () => throttle(handleSubmit, 3000, { leading: true }),
    [handleSubmit]
  )

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      !form.validate().hasErrors &&
        modals.openConfirmModal(
          defaultConfirmModalProps({
            text: `Are you sure you want to ${transferTypeLabels[transferType].label}  ${form.values.amount}  ${form.values.token.name} to ${form.values.accountId}?`,
            color: 'attention',
            labels: { confirm: 'Yes Sir', cancel: 'No' },
            onConfirm: () => form.onSubmit(throttledSbm)()
          })
        )
    },
    [form, throttledSbm, transferType]
  )

  return (
    <Box component="form">
      <Stack gap="xs">
        <SegmentedControl
          color={transferTypeLabels[transferType].color}
          value={transferType}
          onChange={(val) => setTransferType(val as AdminTransferType)}
          data={[
            {
              label: (
                <Center style={{ gap: 10 }}>
                  <ThemeIcon size="sm" variant="transparent" color="mainText">
                    <DepositIcon />
                  </ThemeIcon>
                  <span>Deposit</span>
                </Center>
              ),
              value: 'deposit'
            },
            {
              label: (
                <Center style={{ gap: 10 }}>
                  <ThemeIcon size="sm" variant="transparent" color="mainText">
                    <WithdrawIcon />
                  </ThemeIcon>
                  <span>Refund</span>
                </Center>
              ),
              value: 'credit'
            }
          ]}
        />
        <TextInput
          label="Account address"
          placeholder="0x000"
          withAsterisk
          {...form.getInputProps('accountId')}
          disabled
        />
        <Group grow align="baseline">
          <NumberInput
            label="Amount"
            description={transferType === 'credit' ? `available balance: ${balance}` : undefined}
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
            {...form.getInputProps('token.name')}
          />
        </Group>
        <Group grow align="baseline">
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
        </Group>
        <Group grow align="baseline">
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

        <Group justify="left" mt="md">
          <Button
            color={transferTypeLabels[transferType].color}
            type="submit"
            loading={loading}
            disabled={loading || !form.isDirty()}
            onClick={onSubmit}
          >
            Make {transferTypeLabels[transferType].label}
          </Button>
        </Group>
      </Stack>
    </Box>
  )
}

export { AdminDeposit }
