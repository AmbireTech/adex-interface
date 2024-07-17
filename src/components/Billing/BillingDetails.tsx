import { Button, Flex, Grid, TextInput, Text, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useForm } from '@mantine/form'
import { useColorScheme } from '@mantine/hooks'
import useAccount from 'hooks/useAccount'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    container: {
      backgroundColor: theme.colors.mainBackground[primaryShade],
      borderRadius: theme.radius.sm,
      boxShadow: theme.shadows.xs,
      overflow: 'hidden',
      padding: theme.spacing.lg
    }
  }
})

const BillingDetails = () => {
  const { classes } = useStyles()
  const {
    updateBillingDetails,
    adexAccount: { billingDetails }
  } = useAccount()

  const form = useForm({
    initialValues: billingDetails,

    validate: {
      firstName: (value: string) => {
        if (value.length > 0 && value.length < 2) {
          return 'First name must have at least 2 letters'
        }

        return null
      },
      lastName: (value: string) => {
        if (value.length > 0 && value.length < 2) {
          return 'Last name must have at least 2 letters'
        }

        return null
      },
      companyName: (value: string) =>
        value.length < 2 ? 'Company name must have at least 2 characters' : null,
      companyNumber: (value: string) =>
        value.length === 0 ? 'Registration number is required' : null,
      companyNumberPrim: () => null, // No validation for VAT number
      companyAddress: (value: string) =>
        value.length === 0 ? 'Company address is required' : null,
      companyCountry: (value: string) => (value.length === 0 ? 'Country is required' : null),
      companyCity: (value: string) => (value.length === 0 ? 'City is required' : null),
      companyZipCode: (value: string) => (value.length === 0 ? 'Zip code is required' : null) // Zip code can be alphanumeric
    }
  })

  return (
    <form
      className={classes.container}
      onSubmit={form.onSubmit((values) => updateBillingDetails(values))}
    >
      <Grid gutter="xs">
        <Grid.Col>
          <Text size="sm" c="secondaryText" fw="bold">
            Company details
          </Text>
        </Grid.Col>
        <Grid.Col>
          <TextInput
            radius="sm"
            size="lg"
            placeholder="First name"
            {...form.getInputProps('firstName')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            radius="sm"
            size="lg"
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
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Registration number"
            {...form.getInputProps('companyNumber')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            radius="sm"
            size="lg"
            placeholder="VAT number"
            {...form.getInputProps('companyNumberPrim')}
          />
        </Grid.Col>
        <Grid.Col>
          <Text size="sm" c="secondaryText" fw="bold">
            Company address
          </Text>
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
          {/* <Select
            size="lg"
            required
            data={['Country 1', 'Country 2', 'Country 3']}
            placeholder="Select Country"
            {...form.getInputProps('companyCountry')}
          /> */}
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Country"
            {...form.getInputProps('companyCountry')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          {/* <Select
            size="lg"
            required
            data={['City 1', 'City 2', 'City 3']}
            placeholder="Select City"
            {...form.getInputProps('companyCity')}
          /> */}
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="City"
            {...form.getInputProps('companyCity')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            radius="sm"
            size="lg"
            required
            // hideControls
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
