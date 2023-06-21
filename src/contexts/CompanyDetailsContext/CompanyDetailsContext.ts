import { createFormContext } from '@mantine/form'
import { IBillingDetails } from 'types'

export const [BillingDetailsFormProvider, useBillingDetailsFormContext, useBillingDetailsForm] =
  createFormContext<IBillingDetails>()
