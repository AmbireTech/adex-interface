import {
  ActionIcon,
  Flex,
  Group,
  MantineTheme,
  Pagination,
  Table,
  getPrimaryShade
} from '@mantine/core'
import { ICustomTableProps } from 'types'
import usePagination from 'hooks/usePagination'
import React, { useCallback, useMemo, useState } from 'react'
import DownChevronIcon from 'resources/icons/DownChevron'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    header: {
      backgroundColor: theme.colors.alternativeBackground[primaryShade]
    },
    border: {
      borderRadius: theme.radius.md,
      overflow: 'hidden'
    },
    background: {
      backgroundColor: theme.colors.mainBackground[primaryShade],
      boxShadow: theme.shadows.xs
    }
  }
})

const CustomTableWithDropdown = ({ background, headings, elements }: ICustomTableProps) => {
  const { classes, cx } = useStyles()
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
    () => headings.map((heading) => <Table.Th key={heading}>{heading}</Table.Th>),
    [headings]
  )

  const [expandedRows, setExpandedRows] = useState<string[]>([])

  const handleRowClick = useCallback(
    (rowId: string) => {
      const newExpandedRows = expandedRows.includes(rowId)
        ? expandedRows.filter((id) => id !== rowId)
        : [...expandedRows, rowId]

      setExpandedRows(newExpandedRows)
    },
    [expandedRows]
  )

  const rows = useMemo(
    () =>
      list.map((e) => {
        return (
          <React.Fragment key={e.id}>
            <Table.Tr>
              {columns.map((column: string, index) => {
                return (
                  <Table.Td key={column}>
                    <Flex align="center">
                      {index === 0 && (
                        <ActionIcon
                          size="26px"
                          mr="sm"
                          color="brand"
                          onClick={() => handleRowClick(e.id.toString())}
                        >
                          <DownChevronIcon />
                        </ActionIcon>
                      )}
                      {typeof e[column] === 'object' &&
                      typeof e[column].from === 'string' &&
                      typeof e[column].to === 'string'
                        ? `${e[column].from} - ${e[column].to}`
                        : e[column]}
                    </Flex>
                  </Table.Td>
                )
              })}
            </Table.Tr>
            {expandedRows.includes(e.id.toString()) && (
              <Table.Tr>
                <Table.Td colSpan={headings.length} height={600}>
                  {/* content here */}
                </Table.Td>
              </Table.Tr>
            )}
          </React.Fragment>
        )
      }),
    [columns, list, expandedRows, handleRowClick, headings.length]
  )

  return (
    <Flex h="100%" justify="space-between" direction="column" align="center">
      <Table
        highlightOnHover
        verticalSpacing={15}
        className={cx(classes.border, { [classes.background]: background })}
      >
        <Table.Thead className={classes.header}>
          <Table.Tr>{head}</Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <Group w="100%" justify="right" mt="xl">
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

export default CustomTableWithDropdown
