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
import VisibilityIcon from 'resources/icons/Visibility'
import { ICustomTableProps } from 'types'
import usePagination from 'hooks/usePagination'
import { useMemo } from 'react'
import InvoicesPDF from './InvoicesPDF'

const useStyles = createStyles((theme) => ({
  wrapper: {
    border: '1px solid',
    borderRadius: theme.radius.sm,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    padding: theme.spacing.lg
  },
  header: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: theme.spacing.xl
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: theme.other.fontWeights.bold
  },
  close: {
    color: theme.colors.mainText[theme.fn.primaryShade()]
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
      padding: theme.spacing.xl
    }
  }
}))

const CustomTable = ({ headings, elements }: ICustomTableProps) => {
  const { classes } = useStyles()
  const [opened, { open, close }] = useDisclosure(false)
  const columns: string[] = useMemo(() => Object.keys(elements[0]), [elements])
  const maxItemsPerPage = 10
  const { maxPages, defaultPage, startIndex, endIndex, onNextPage, onPreviousPage, onChange } =
    usePagination({
      elementsLength: elements.length,
      maxItemsPerPage
    })
  const list = useMemo(() => {
    return elements.slice(startIndex, endIndex)
  }, [elements, startIndex, endIndex])

  const head = useMemo(
    () => headings.map((heading) => <th key={heading}>{heading}</th>),
    [headings]
  )

  const rows = useMemo(
    () =>
      list.map((e, index) => (
        // eslint-disable-next-line
        <tr key={index}>
          {columns.map((column: string) => {
            return (
              <td key={column}>
                {typeof e[column] === 'object' &&
                typeof e[column].from === 'string' &&
                typeof e[column].to === 'string'
                  ? `${e[column].from} - ${e[column].to}`
                  : e[column]}
              </td>
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
      )),
    [columns, list, open]
  )

  return (
    <Flex h="100%" justify="space-between" direction="column" align="center">
      <Table highlightOnHover verticalSpacing={15}>
        <thead>
          <tr>
            {head}
            <th key="Action">Action</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
      <Group position="right">
        <Pagination
          total={maxPages}
          boundaries={1}
          defaultValue={defaultPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onChange={(value) => onChange(value)}
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
