import { useForm } from '@mantine/form'
import { Button, Group, TextInput, Box, NumberInput, Text, Switch, Textarea } from '@mantine/core'

import { Account } from 'types'

function AccountInfo({ accountData }: { accountData: Account }) {
  const form = useForm<Account>({
    initialValues: accountData,
    validate: {}
  })

  return (
    <Box
      component="form"
      maw={400}
      mx="auto"

      //   onSubmit={form.onSubmit(throttledSbm)}
    >
      <TextInput
        label="Account name"
        placeholder="0x000"
        withAsterisk
        {...form.getInputProps('name')}
        disabled
      />
      <NumberInput
        mt="sm"
        type="number"
        placeholder="Amount"
        hideControls
        disabled
        {...form.getInputProps('availableBalance')}
      />
      <Text size="sm" weight={500} mt="md">
        Billing details
      </Text>
      <Group mt="md" position="apart">
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
          label="Company ZIP cosde"
          disabled
          {...form.getInputProps('billingDetails.companyZipCode')}
        />
        <Switch label="Verified by admin" {...form.getInputProps('billingDetails.verified')} />
      </Group>

      <Text size="sm" weight={500} mt="md">
        Additional info
      </Text>

      <Group mt="md" position="apart">
        <TextInput label="Contact email" {...form.getInputProps('info.email')} />
        <TextInput label="Contact phone" {...form.getInputProps('info.phone')} />
        <TextInput label="Contact person" {...form.getInputProps('info.contactPerson')} />
        <Textarea label="Additional notes" {...form.getInputProps('info.notes')} />
      </Group>

      <Group position="right" mt="md">
        <Button
          type="submit"
          //   disabled={loading}
        >
          Submit
        </Button>
      </Group>
    </Box>
  )
}

export { AccountInfo }
