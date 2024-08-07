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
  Box
} from '@mantine/core'
import { useForm } from '@mantine/form'
import useAccount from 'hooks/useAccount'
import { CountryNames } from 'helpers/countries'
import CheckMarkIcon from 'resources/icons/CheckMark'
import CustomAnchor from 'components/common/customAnchor'

const BillingDetails = () => {
  const {
    updateBillingDetails,
    adexAccount: { billingDetails }
  } = useAccount()

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
      companyNumberPrim: () => null, // No validation for VAT number
      companyAddress: (value: string) =>
        value.length === 0 ? 'Company address is required' : null,
      companyCountry: (value: string) => (value.length === 0 ? 'Country is required' : null),
      companyCity: (value: string) => (value.length === 0 ? 'City is required' : null),
      companyZipCode: (value: string) => (value.length === 0 ? 'Zip code is required' : null) // Zip code can be alphanumeric
    }
  })

  return (
    <Fieldset disabled={billingDetails.verified}>
      <form onSubmit={form.onSubmit((values) => updateBillingDetails(values))}>
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
          <Group>
            {billingDetails.verified ? (
              <Box>
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
                <Text mt="md">
                  Your billing details are verified and cannot be changed here. If there is a
                  mistake and changes need to be made, please contact us at &nbsp;
                  <CustomAnchor external href="mailto:contactus@adex.network">
                    contactus@adex.network
                  </CustomAnchor>
                  .
                </Text>
              </Box>
            ) : (
              <Box>
                <Button miw={260} size="lg" type="submit" color="secondary" variant="outline">
                  Confirm details
                </Button>
                <Text mt="md">
                  Fill in your billing details and contact us at &nbsp;
                  <CustomAnchor external href="mailto:contactus@adex.network">
                    contactus@adex.network
                  </CustomAnchor>
                  &nbsp; to verify the data.
                </Text>
              </Box>
            )}
          </Group>
        </Stack>
      </form>
    </Fieldset>
  )
}

export default BillingDetails
