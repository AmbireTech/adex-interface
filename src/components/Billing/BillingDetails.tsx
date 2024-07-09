import { Button, Flex, Grid, TextInput, createStyles, Text } from '@mantine/core'
import { useForm } from '@mantine/form'
import useAccount from 'hooks/useAccount'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { useCallback } from 'react'
import { fetchService } from 'services'
import { BillingDetailsProps } from 'types'

type ValidationResult = {
  isValid: boolean
  error: string | null
}

enum CountryCodes {
  Austria = 'AT',
  Belgium = 'BE',
  Bulgaria = 'BG',
  Croatia = 'HR',
  Cyprus = 'CY',
  'Czech Republic' = 'CZ',
  Denmark = 'DK',
  Estonia = 'EE',
  Finland = 'FI',
  France = 'FR',
  Germany = 'DE',
  Greece = 'EL',
  Hungary = 'HU',
  Ireland = 'IE',
  Italy = 'IT',
  Latvia = 'LV',
  Lithuania = 'LT',
  Luxembourg = 'LU',
  Malta = 'MT',
  Netherlands = 'NL',
  Poland = 'PL',
  Portugal = 'PT',
  Romania = 'RO',
  Slovakia = 'SK',
  Slovenia = 'SI',
  Spain = 'ES',
  Sweden = 'SE',
  'Northern Ireland' = 'XI'
}

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.xs,
    overflow: 'hidden',
    padding: theme.spacing.lg
  }
}))

const isValidCountryCode = (code: string): code is keyof typeof CountryCodes => {
  return code in CountryCodes
}

const validateVAT = async (
  country: keyof typeof CountryCodes,
  vat: string
): Promise<ValidationResult> => {
  if (!country || !vat) return { isValid: false, error: 'Invalid input' }
  const countryCode = CountryCodes[country]
  let isValid = false
  let error = null

  try {
    const response = await fetchService({
      url: `https://ec.europa.eu/taxation_customs/vies/rest-api/ms/${countryCode}/vat/${vat}`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error('Invalid response from VAT validation API')
    }

    isValid = result.valid
  } catch (e: any) {
    console.error(e.message || e)
    error = e.message || e
  }

  return { isValid, error }
}

const BillingDetails = () => {
  const { classes } = useStyles()
  const {
    updateBillingDetails,
    adexAccount: { billingDetails }
  } = useAccount()
  const { showNotification } = useCustomNotifications()
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
      companyAddress: (value: string) =>
        value.length === 0 ? 'Company address is required' : null,
      companyCountry: (value: string) => (value.length === 0 ? 'Country is required' : null),
      companyCity: (value: string) => (value.length === 0 ? 'City is required' : null),
      companyZipCode: (value: string) => (value.length === 0 ? 'Zip code is required' : null) // Zip code can be alphanumeric
    }
  })

  const handleSubmit = useCallback(
    async (values: BillingDetailsProps) => {
      try {
        const { companyNumberPrim, companyCountry } = values

        if (companyNumberPrim && companyCountry && isValidCountryCode(companyCountry)) {
          const { isValid, error } = await validateVAT(
            companyCountry as keyof typeof CountryCodes,
            companyNumberPrim
          )
          if (!isValid) {
            form.setFieldError('companyNumberPrim', error || 'Invalid VAT number')
            showNotification('error', error || 'Validating VAT number', 'Validating VAT number')
            return
          }
        }

        updateBillingDetails(values)
      } catch (e: any) {
        console.error(e)
        showNotification(
          'error',
          'Validating VAT number',
          e.message || e || 'Validating VAT number'
        )
      }
    },
    [updateBillingDetails, form, showNotification]
  )

  return (
    <form className={classes.container} onSubmit={form.onSubmit((values) => handleSubmit(values))}>
      <Grid gutter="xs">
        <Grid.Col>
          <Text size="sm" color="secondaryText" weight="bold">
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
          <Text size="sm" color="secondaryText" weight="bold">
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
