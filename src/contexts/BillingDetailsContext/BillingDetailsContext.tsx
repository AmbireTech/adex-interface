import { FC, PropsWithChildren } from 'react'
import { createFormContext } from '@mantine/form'
import { BillingDetails } from 'types'

const [BillingDetailsFormProvider, useBillingDetailsFormContext, useBillingDetailsForm] =
  createFormContext<BillingDetails>()

const BillingDetailsProvider: FC<PropsWithChildren> = ({ children }) => {
  const billingDetailsForm = useBillingDetailsForm({
    validate: {
      firstName: (value: string) =>
        value.length < 2 ? 'First name must have at least 2 letters' : null,
      lastName: (value: string) =>
        value.length < 2 ? 'Last name must have at least 2 letters' : null
      // TODO: add validations for all the input fields
    }
  })

  return (
    <BillingDetailsFormProvider form={billingDetailsForm}>{children}</BillingDetailsFormProvider>
  )
}

export { BillingDetailsProvider, useBillingDetailsFormContext }
