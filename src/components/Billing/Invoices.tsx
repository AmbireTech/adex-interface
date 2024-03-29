import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { PrintModal } from 'components/common/Modals'
import { useDisclosure } from '@mantine/hooks'
import { useCallback } from 'react'

import { invoiceElements } from './mockedData'

const columnTitles = ['Company Name', 'Campaign Period', 'Amount Spent']

const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false)

  const handlePreview = useCallback(
    (item: any) => {
      console.log('item', item)
      open()
    },
    [open]
  )

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
