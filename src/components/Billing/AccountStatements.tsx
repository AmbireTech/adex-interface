import { useCallback } from 'react'
import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { PrintModal } from 'components/common/Modals'
import { statementElements } from './mockedData'

const columnTitles = ['Document', 'Date of issue']

const AccountStatements = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const handlePreview = useCallback(
    (item: any) => {
      console.log('item', item)
      open()
    },
    [open]
  )

  return statementElements && statementElements.length ? (
    <>
      <PrintModal opened={opened} close={close} />
      <CustomTable headings={columnTitles} elements={statementElements} onPreview={handlePreview} />
    </>
  ) : (
    // TODO: needs to be styled
    <Title order={4}>No AccountStatements found.</Title>
  )
}

export default AccountStatements
