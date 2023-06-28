import { Button, Flex, Grid, NumberInput, Select, TextInput } from '@mantine/core'
import { useBillingDetailsFormContext } from 'contexts/BillingDetailsContext'

const BillingDetails = () => {
  const form = useBillingDetailsFormContext()
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Grid gutter="xs">
        <Grid.Col>
          <span>Company details</span>
        </Grid.Col>
        <Grid.Col>
          <TextInput
            variant="filled"
            radius="sm"
            size="lg"
            placeholder="First name"
            {...form.getInputProps('firstName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            variant="filled"
            radius="sm"
            size="lg"
            placeholder="Last name"
            {...form.getInputProps('lastName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            variant="filled"
            radius="sm"
            size="lg"
            placeholder="Company name"
            {...form.getInputProps('companyName')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            variant="filled"
            radius="sm"
            size="lg"
            hideControls
            // TODO: change the placeholder
            placeholder="Company number"
            {...form.getInputProps('companyNumber')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            variant="filled"
            radius="sm"
            size="lg"
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
            variant="filled"
            radius="sm"
            size="lg"
            placeholder="Address"
            {...form.getInputProps('companyAddress')}
          />
        </Grid.Col>
        <Grid.Col>
          <Select
            variant="filled"
            size="lg"
            data={['Country 1', 'Country 2', 'Country 3']}
            placeholder="Select Country"
            {...form.getInputProps('companyCountry')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            variant="filled"
            size="lg"
            data={['City 1', 'City 2', 'City 3']}
            placeholder="Select City"
            {...form.getInputProps('companyCity')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            variant="filled"
            radius="sm"
            size="lg"
            hideControls
            // TODO: change the placeholder
            // Check if the input should be Number
            placeholder="Zip Code"
            {...form.getInputProps('companyZipCode')}
          />
        </Grid.Col>
      </Grid>
      <Flex mih={200} justify="center" align="end" wrap="wrap">
        <Button miw={260} size="lg" type="submit" color="secondary" variant="outline">
          Confirmed
        </Button>
      </Flex>
    </form>
  )
}

export default BillingDetails
