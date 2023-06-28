import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { invoiceElements } from './mockedData'

const Invoices = () => {
  const columnTitles = ['Company Name', 'Campaign Period', 'Amount Spent']
  return invoiceElements && invoiceElements.length ? (
    <CustomTable headings={columnTitles} elements={invoiceElements} />
  ) : (
    // TODO: needs to be styled
    <Title order={4}>No invoices found.</Title>
  )
}

export default Invoices
