import {
  ActionIcon,
  Button,
  Flex,
  Group,
  Modal,
  Pagination,
  Table,
  createStyles
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
// import DownloadIcon from 'resources/icons/Download'
import VisibilityIcon from 'resources/icons/Visibility'
import { IInvoices, IStatements } from 'types'
import InvoicesPDF from './InvoicesPDF'

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    padding: 20
  },
  header: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: 30
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.black
  },
  printable: {
    [theme.other.media.print]: {
      // NOTE: it's not fixed/absolute to body but modal.inner
      overflow: 'visible',
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      width: '100%',
      padding: 30 // TODO
    }
  }
}))

const CustomTable = ({
  headings,
  elements
}: {
  headings: string[]
  elements: IInvoices[] | IStatements[]
}) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const columns: string[] = Object.keys(elements[0])
  const maxItemsPerPage = 10
  const defaultPage = 1
  const [page, setPage] = useState(defaultPage)
  const maxPages = Math.ceil(elements.length / maxItemsPerPage)
  const list = elements.slice((page - 1) * maxItemsPerPage, page * maxItemsPerPage)
  const head = (
    <tr>
      {headings.map((heading) => (
        <th key={heading}>{heading}</th>
      ))}
      <th key="Action">Action</th>
    </tr>
  )
  const rows = list.map((e, index) => (
    // eslint-disable-next-line
    <tr key={index}>
      {columns.map((column: string) => {
        return column === 'campaignPeriod' ? (
          <td key={column}>
            {e[column].from} - {e[column].to}
          </td>
        ) : (
          <td key={column}>{e[column]}</td>
        )
      })}
      <td>
        <Group>
          <ActionIcon title="View PDF" onClick={open}>
            <VisibilityIcon />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ))

  return (
    <Flex h="100%" justify="space-between" direction="column" align="center">
      <Table highlightOnHover verticalSpacing={15}>
        <thead>{head}</thead>
        <tbody>{rows}</tbody>
      </Table>
      <Group position="right">
        <Pagination
          total={maxPages}
          boundaries={1}
          defaultValue={defaultPage}
          onNextPage={() =>
            setPage((prevState) => (prevState + 1 <= maxPages ? prevState + 1 : prevState))
          }
          onPreviousPage={() =>
            setPage((prevState) => (prevState - 1 >= defaultPage ? prevState - 1 : prevState))
          }
          onChange={(value) => setPage(value)}
        />
      </Group>
      <Modal
        title="Invoice"
        size="xl"
        opened={opened}
        onClose={close}
        centered
        radius="sm"
        classNames={{
          header: classes.header,
          title: classes.title,
          close: classes.close
        }}
      >
        <div>
          <Group position="right">
            <Button mt="md" mb="md" onClick={() => window.print()}>
              Print
            </Button>
          </Group>
          <div className={classes.wrapper}>
            <div id="printable" className={classes.printable}>
              <InvoicesPDF />
            </div>
          </div>
        </div>
      </Modal>
    </Flex>
  )
}

export default CustomTable
