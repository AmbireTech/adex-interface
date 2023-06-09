import CustomTable from 'components/common/CustomTable'
import { invoiceElements } from './mockedData'

const Invoices = () => {
  const columnTitles = ['Company Name', 'Campaign Period', 'Amount Spent']
  return <CustomTable headings={columnTitles} elements={invoiceElements} />
}

export default Invoices
