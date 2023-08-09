import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { PrintModal } from 'components/common/Modals'
import { useDisclosure } from '@mantine/hooks'

import { invoiceElements } from './mockedData'

const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false)

  const columnTitles = ['Company Name', 'Campaign Period', 'Amount Spent']
  const handlePreview = (item: any) => {
    console.log('item', item)
    open()
  }

  return invoiceElements && invoiceElements.length ? (
    <>
      <CustomTable headings={columnTitles} elements={invoiceElements} onPreview={handlePreview} />
      <PrintModal opened={opened} close={close} />
    </>
  ) : (
    // TODO: needs to be style
    <Title order={4}>No invoices found.</Title>
  )
}

export default Invoices
