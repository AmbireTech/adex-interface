import { FC, PropsWithChildren } from 'react'
import { initBillingDetails } from 'components/Billing/Invoices/mockedData'
import { BillingDetailsFormProvider, useBillingDetailsForm } from './CompanyDetailsContext'

const BillingDetailsContext: FC<PropsWithChildren> = ({ children }) => {
  const billingDetailsForm = useBillingDetailsForm({
    initialValues: initBillingDetails,
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

export default BillingDetailsContext
