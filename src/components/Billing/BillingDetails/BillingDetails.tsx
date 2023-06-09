import { Button, Center, Grid, NumberInput, Select, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'

const BillingDetails = () => {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      companyName: '',
      companyNumber: 1,
      companyNumberPrim: 2,
      companyAddress: '',
      companyCountry: '',
      companyCity: '',
      companyZipCode: 0
    }
  })
  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Grid h="100%" grow>
        <Grid.Col>
          <span>Company details</span>
        </Grid.Col>
        <Grid.Col>
          <TextInput
            variant="filled"
            radius="sm"
            size="md"
            placeholder="First name"
            {...form.getInputProps('firstName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            variant="filled"
            radius="sm"
            size="md"
            placeholder="Last name"
            {...form.getInputProps('lastName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            variant="filled"
            radius="sm"
            size="md"
            placeholder="Company name"
            {...form.getInputProps('companyName')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            variant="filled"
            radius="sm"
            size="md"
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
            size="md"
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
            size="md"
            placeholder="Address"
            {...form.getInputProps('companyAddress')}
          />
        </Grid.Col>
        <Grid.Col>
          <Select
            variant="filled"
            size="md"
            data={['Country 1', 'Country 2', 'Country 3']}
            placeholder="Select Country"
            {...form.getInputProps('companyCountry')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            variant="filled"
            size="md"
            data={['City 1', 'City 2', 'City 3']}
            placeholder="Select City"
            {...form.getInputProps('companyCity')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            variant="filled"
            radius="sm"
            size="md"
            hideControls
            // TODO: change the placeholder
            // Check if the input should be Number
            placeholder="Zip Code"
            {...form.getInputProps('companyZipCode')}
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <Center>
            <Button type="submit" variant="outline">
              Confirm
            </Button>
          </Center>
        </Grid.Col>
      </Grid>
    </form>
  )
}

export default BillingDetails
