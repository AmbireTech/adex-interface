import CustomTable from 'components/common/CustomTable'
import { statementElements } from '../Invoices/mockedData'

const AccountStatements = () => {
  const columnTitles = ['Document', 'Date of issue']
  return <CustomTable headings={columnTitles} elements={statementElements} />
}

export default AccountStatements
