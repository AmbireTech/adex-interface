import {
  Button,
  Group,
  TextInput,
  Text,
  Stack,
  Space,
  Select,
  Fieldset,
  ThemeIcon,
  getPrimaryShade
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useForm } from '@mantine/form'
import { useColorScheme } from '@mantine/hooks'
import CustomAnchor from 'components/common/customAnchor'
import { CountryNames } from 'helpers/countries'
import useAccount from 'hooks/useAccount'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { useCallback } from 'react'
import CheckMarkIcon from 'resources/icons/CheckMark'
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

const useStyles = createStyles((theme) => {
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
    validateInputOnBlur: true,
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
    <Fieldset disabled={billingDetails.verified}>
      <form
        className={classes.container}
        onSubmit={form.onSubmit((values) => handleSubmit(values))}
      >
        <Stack>
          <Text size="sm" c="dimmed" fw="bold">
            Company details
          </Text>
          <TextInput
            radius="sm"
            size="lg"
            placeholder="First name"
            {...form.getInputProps('firstName')}
          />
          <TextInput
            radius="sm"
            size="lg"
            placeholder="Last name"
            {...form.getInputProps('lastName')}
          />
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Company name"
            {...form.getInputProps('companyName')}
          />
          <Group grow>
            <TextInput
              radius="sm"
              size="lg"
              required
              placeholder="Registration number"
              {...form.getInputProps('companyNumber')}
            />
            <TextInput
              radius="sm"
              size="lg"
              placeholder="VAT number"
              {...form.getInputProps('companyNumberPrim')}
            />
          </Group>
          <Space />
          <Text size="sm" c="dimmed" fw="bold">
            Company address
          </Text>
          <TextInput
            radius="sm"
            size="lg"
            required
            placeholder="Address"
            {...form.getInputProps('companyAddress')}
          />
          <Select
            size="lg"
            required
            searchable
            data={CountryNames}
            placeholder="Select Country"
            {...form.getInputProps('companyCountry')}
          />
          {/* <Select
            size="lg"
            required
            data={['City 1', 'City 2', 'City 3']}
            placeholder="Select City"
            {...form.getInputProps('companyCity')}
          /> */}

          <Group grow>
            <TextInput
              radius="sm"
              size="lg"
              required
              placeholder="City"
              {...form.getInputProps('companyCity')}
            />
            <TextInput
              radius="sm"
              size="lg"
              required
              placeholder="Zip Code"
              {...form.getInputProps('companyZipCode')}
            />
          </Group>

          <Space />
          <Stack align="baseline" gap="xs">
            {billingDetails.verified ? (
              <Button
                miw={260}
                size="lg"
                type="submit"
                leftSection={
                  <ThemeIcon size="xl" variant="transparent" radius="xl" color="success">
                    <CheckMarkIcon size="36px" />{' '}
                  </ThemeIcon>
                }
                color="success"
                variant="outline"
              >
                Verified
              </Button>
            ) : (
              <Button miw={260} size="lg" type="submit" color="secondary" variant="outline">
                Confirm details
              </Button>
            )}

            {billingDetails.verified ? (
              <Text mt="md">
                Your billing details are verified and cannot be changed here. If there is a mistake
                and changes need to be made, please contact us at &nbsp;
                <CustomAnchor external href="mailto:contactus@adex.network">
                  contactus@adex.network
                </CustomAnchor>
                .
              </Text>
            ) : (
              <Text mt="md">
                Fill in your billing details and contact us at &nbsp;
                <CustomAnchor external href="mailto:contactus@adex.network">
                  contactus@adex.network
                </CustomAnchor>
                &nbsp; to verify the data.
              </Text>
            )}
          </Stack>
        </Stack>
      </form>
    </Fieldset>
  )
}

export default BillingDetails
