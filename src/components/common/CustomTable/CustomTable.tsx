import { Flex, Group, Pagination, Table } from '@mantine/core'
import VisibilityIcon from 'resources/icons/Visibility'
import { ICustomTableProps } from 'types'
import usePagination from 'hooks/usePagination'
import { useMemo } from 'react'
import AnalyticsIcon from 'resources/icons/Analytics'
import DuplicateIcon from 'resources/icons/Duplicate'
import DeleteIcon from 'resources/icons/Delete'
import ActionButton from './ActionButton/ActionButton'

const CustomTable = ({
  headings,
  elements,
  onPreview,
  onAnalytics,
  onDuplicate,
  onDelete
}: ICustomTableProps) => {
  const columns: string[] = useMemo(
    () => Object.keys(elements[0]).filter((e: string) => e !== 'id'),
    [elements]
  )
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

  const hasAction = !!onPreview || !!onAnalytics || !!onDuplicate || !!onDelete

  const rows = useMemo(
    () =>
      list.map((e) => {
        return (
          <tr key={e.id}>
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
            {hasAction && (
              <td>
                <Group>
                  {!!onPreview && (
                    <ActionButton
                      title="View PDF"
                      icon={<VisibilityIcon size="20px" />}
                      action={() => onPreview(e)}
                    />
                  )}
                  {!!onAnalytics && (
                    <ActionButton
                      title="View Analytics"
                      icon={<AnalyticsIcon size="20px" />}
                      action={() => onAnalytics(e)}
                    />
                  )}
                  {!!onDuplicate && (
                    <ActionButton
                      title="Duplicate"
                      icon={<DuplicateIcon size="20px" />}
                      action={() => onDuplicate(e)}
                    />
                  )}
                  {!!onDelete && (
                    <ActionButton
                      title="Delete"
                      icon={<DeleteIcon size="20px" />}
                      action={() => onDelete(e)}
                    />
                  )}
                </Group>
              </td>
            )}
          </tr>
        )
      }),
    [columns, list, hasAction, onPreview, onAnalytics, onDuplicate, onDelete]
  )

  return (
    <Flex h="100%" justify="space-between" direction="column" align="center">
      <Table highlightOnHover verticalSpacing={15}>
        <thead>
          <tr>
            {head}
            {hasAction && <th key="Action">Action</th>}
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
    </Flex>
  )
}

export default CustomTable
