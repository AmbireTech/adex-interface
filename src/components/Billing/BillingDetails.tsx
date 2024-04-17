import { Button, Flex, Grid, NumberInput, Select, TextInput } from '@mantine/core'
import { useBillingDetailsFormContext } from 'contexts/BillingDetailsContext'
import useAccount from 'hooks/useAccount'

const BillingDetails = () => {
  const {
    updateBillingDetails,
    adexAccount: { billingDetails }
  } = useAccount()

  const form = useBillingDetailsFormContext()

  return (
    <form onSubmit={form.onSubmit((values) => updateBillingDetails(values))}>
      <Grid gutter="xs">
        <Grid.Col>
          <span>Company details</span>
        </Grid.Col>
        <Grid.Col>
          <TextInput
            defaultValue={billingDetails.firstName}
            radius="sm"
            size="lg"
            required
            placeholder="First name"
            {...form.getInputProps('firstName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            defaultValue={billingDetails.lastName}
            radius="sm"
            size="lg"
            required
            placeholder="Last name"
            {...form.getInputProps('lastName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            defaultValue={billingDetails.companyName}
            radius="sm"
            size="lg"
            required
            placeholder="Company name"
            {...form.getInputProps('companyName')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <NumberInput
            defaultValue={billingDetails.companyNumber}
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
            defaultValue={billingDetails.companyNumberPrim}
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
            defaultValue={billingDetails.companyAddress}
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
            defaultValue={billingDetails.companyCountry}
            {...form.getInputProps('companyCountry')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Select
            size="lg"
            required
            data={['City 1', 'City 2', 'City 3']}
            placeholder="Select City"
            defaultValue={billingDetails.companyCity}
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
            defaultValue={billingDetails.companyZipCode}
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
