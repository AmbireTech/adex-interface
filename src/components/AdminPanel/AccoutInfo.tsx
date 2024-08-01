import { useMemo, useCallback, useState } from 'react'
import { hasLength, matches, useForm, isEmail } from '@mantine/form'

import { Button, Group, TextInput, Box, NumberInput, Text, Textarea, Switch } from '@mantine/core'
import throttle from 'lodash.throttle'

import { Account } from 'types'
import useAdmin from 'hooks/useAdmin/useAdmin'
import useCustomNotifications from 'hooks/useCustomNotifications'

function AccountInfo({ accountData }: { accountData: Account }) {
  const { showNotification } = useCustomNotifications()
  const { updateAccountInfo } = useAdmin()
  const [loading, setLoading] = useState(false)
  const form = useForm<Account>({
    initialValues: accountData,
    validate: {
      name: (val) => (val ? hasLength({ min: 1 })(val) : null),
      info: {
        contactPerson: (val) => (val ? hasLength({ min: 1 })(val) : null),
        phone: (val) =>
          val
            ? matches(
                /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
                'Invalid phone number'
              )(val)
            : null,
        email: (val) => (val ? isEmail('invalid Email')(val) : null)
      }
    },
    validateInputOnBlur: true
  })

  const handleSubmit = useCallback(
    async (values: Account) => {
      setLoading(true)
      await updateAccountInfo(
        values,
        () => {
          //   form.reset()
          form.resetTouched()
          form.resetDirty()
          showNotification('info', 'Account data updated!')
        },
        (err) => {
          showNotification('error', err, 'Error on account Account data updated!')
        }
      )

      setLoading(false)
    },
    [form, showNotification, updateAccountInfo]
  )

  const throttledSbm = useMemo(() => {
    return throttle(handleSubmit, 3000, { leading: true })
  }, [handleSubmit])

  return (
    <Box component="form" onSubmit={form.onSubmit(throttledSbm)}>
      <TextInput
        label="Account name"
        placeholder="0x000"
        withAsterisk
        {...form.getInputProps('name')}
        // disabled
      />
      <NumberInput
        mt="md"
        label="Available balance"
        // type="number"
        placeholder="Amount"
        hideControls
        disabled
        {...form.getInputProps('availableBalance')}
      />
      <Text size="sm" fw={500} mt="xl">
        Billing details
      </Text>
      <Text size="xs">* Just for info, users can edit, admins can verify only</Text>
      <Group mt="md" justify="left" align="baseline">
        <TextInput
          label="First name"
          disabled
          {...form.getInputProps('billingDetails.firstName')}
        />
        <TextInput label="Last name" disabled {...form.getInputProps('billingDetails.lastName')} />
        <TextInput
          label="Company number"
          disabled
          {...form.getInputProps('billingDetails.companyNumber')}
        />
        <TextInput
          label="VAT number"
          disabled
          {...form.getInputProps('billingDetails.companyNumberPrim')}
        />
        <TextInput
          label="Company address"
          disabled
          {...form.getInputProps('billingDetails.companyAddress')}
        />
        <TextInput
          label="Company country"
          disabled
          {...form.getInputProps('billingDetails.companyCountry')}
        />

        <TextInput
          label="Company city"
          disabled
          {...form.getInputProps('billingDetails.companyCity')}
        />
        <TextInput
          label="Company ZIP code"
          disabled
          {...form.getInputProps('billingDetails.companyZipCode')}
        />
        <Switch
          label="Verified by admin"
          {...form.getInputProps('billingDetails.verified', { type: 'checkbox' })}
        />
      </Group>

      <Text size="sm" fw={500} mt="xl">
        Additional info
      </Text>
      <Text size="xs">* can be seen and edited only by admins</Text>

      <Group mt="md" justify="left" align="baseline">
        <TextInput label="Contact email" {...form.getInputProps('info.email')} />
        <TextInput label="Contact phone" {...form.getInputProps('info.phone')} />
        <TextInput label="Contact person" {...form.getInputProps('info.contactPerson')} />
        <Textarea label="Additional notes" w="100%" {...form.getInputProps('info.notes')} />
      </Group>

      <Group justify="left" mt="md">
        <Button type="submit" loading={loading} disabled={loading || !form.isDirty()}>
          Update account data
        </Button>
      </Group>
    </Box>
  )
}

export { AccountInfo }
