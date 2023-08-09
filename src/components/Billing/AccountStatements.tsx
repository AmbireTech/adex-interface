import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { PrintModal } from 'components/common/Modals'
import { statementElements } from './mockedData'

const AccountStatements = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const columnTitles = ['Document', 'Date of issue']
  const handlePreview = (item: any) => {
    console.log('item', item)
    open()
  }

  return statementElements && statementElements.length ? (
    <>
      <CustomTable headings={columnTitles} elements={statementElements} onPreview={handlePreview} />
      <PrintModal opened={opened} close={close} />
    </>
  ) : (
    // TODO: needs to be styled
    <Title order={4}>No AccountStatements found.</Title>
  )
}

export default AccountStatements
