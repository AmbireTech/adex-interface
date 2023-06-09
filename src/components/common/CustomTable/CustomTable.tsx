import { ActionIcon, Flex, Group, Pagination, Table } from '@mantine/core'
import { useState } from 'react'
import DownloadIcon from 'resources/icons/Download'
import VisibilityIcon from 'resources/icons/Visibility'

interface IInvoices {
  [index: string]: any
  companyName: string
  campaignPeriod: {
    from: string
    to: string
  }
  amountSpent: string
}

interface IStatements {
  [index: string]: any
  documentName: string
  dateOfIssue: string
}

const CustomTable = ({
  headings,
  elements
}: {
  headings: string[]
  elements: IInvoices[] | IStatements[]
}) => {
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
          <td>
            <div>{e[column].from}</div>
            <div>{e[column].to}</div>
          </td>
        ) : (
          <td key={column}>{e[column]}</td>
        )
      })}
      <td>
        <Group>
          <ActionIcon title="View PDF" onClick={() => console.log('Preview clicked')}>
            <VisibilityIcon />
          </ActionIcon>
          <ActionIcon title="Download PDF" onClick={() => console.log('Download clicked')}>
            <DownloadIcon />
          </ActionIcon>
        </Group>
      </td>
    </tr>
  ))

  return (
    <Flex h="100%" justify="space-between" direction="column" align="center">
      <Table highlightOnHover verticalSpacing="md">
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
    </Flex>
  )
}

export default CustomTable
