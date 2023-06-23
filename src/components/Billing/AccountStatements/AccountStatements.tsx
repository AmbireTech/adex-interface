import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { statementElements } from '../Invoices/mockedData'

const AccountStatements = () => {
  const columnTitles = ['Document', 'Date of issue']
  return statementElements && statementElements.length ? (
    <CustomTable headings={columnTitles} elements={statementElements} />
  ) : (
    // TODO: needs to be styled
    <Title order={4}>No AccountStatements found.</Title>
  )
}

export default AccountStatements
