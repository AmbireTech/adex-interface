import { Button, Flex, Grid, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import useAccount from 'hooks/useAccount'

const BillingDetails = () => {
  const {
    updateBillingDetails,
    adexAccount: { billingDetails }
  } = useAccount()

  const form = useForm({
    initialValues: billingDetails,

    validate: {
      firstName: (value: string) =>
        value.length < 2 ? 'First name must have at least 2 letters' : null,
      lastName: (value: string) =>
        value.length < 2 ? 'Last name must have at least 2 letters' : null,
      companyName: (value: string) =>
        value.length < 2 ? 'Company name must have at least 2 characters' : null,
      companyNumber: (value: number) =>
        Number.isNaN(value) ? 'Company number must be a valid number' : null,
      companyNumberPrim: (value: number) =>
        Number.isNaN(value) ? 'Company number 2 must be a valid number' : null,
      companyAddress: (value: string) =>
        value.length === 0 ? 'Company address is required' : null,
      companyCountry: (value: string) => (value.length === 0 ? 'Please select a country' : null),
      companyCity: (value: string) => (value.length === 0 ? 'Please select a city' : null),
      companyZipCode: (value: number) =>
        Number.isNaN(value) ? 'Zip code must be a valid number' : null
    }
  })

  return (
    <form onSubmit={form.onSubmit((values) => updateBillingDetails(values))}>
      <Grid gutter="xs">
        <Grid.Col>
          <span>Company details</span>
        </Grid.Col>
        <Grid.Col>
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="First name"
            {...form.getInputProps('firstName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Last name"
            {...form.getInputProps('lastName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Company name"
            {...form.getInputProps('companyName')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            radius="sm"
            size="lg"
            required
            hideControls
            // TODO: change the placeholder
            placeholder="Company number"
            {...form.getInputProps('companyNumber')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            radius="sm"
            size="lg"
            required
            hideControls
            // TODO: change the placeholder
            placeholder="Company number 2"
            {...form.getInputProps('companyNumberPrim')}
          />
        </Grid.Col>
        <Grid.Col>
          <span>Company address</span>
        </Grid.Col>
        <Grid.Col>
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Address"
            {...form.getInputProps('companyAddress')}
          />
        </Grid.Col>
        <Grid.Col>
          <Select
            size="lg"
            required
            data={['Country 1', 'Country 2', 'Country 3']}
            placeholder="Select Country"
            {...form.getInputProps('companyCountry')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            size="lg"
            required
            data={['City 1', 'City 2', 'City 3']}
            placeholder="Select City"
            {...form.getInputProps('companyCity')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            radius="sm"
            size="lg"
            required
            hideControls
            // TODO: change the placeholder
            // Check if the input should be Number
            placeholder="Zip Code"
            {...form.getInputProps('companyZipCode')}
          />
        </Grid.Col>
      </Grid>
      <Flex mih={200} justify="center" align="end" wrap="wrap">
        <Button miw={260} size="lg" type="submit" color="secondary" variant="filled">
          Confirmed
        </Button>
      </Flex>
    </form>
  )
}

export default BillingDetails
