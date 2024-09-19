import {
  Group,
  Pagination,
  Table,
  Text,
  Stack,
  Menu,
  ActionIcon,
  TableProps,
  MantineColor,
  Tooltip,
  Paper,
  ScrollArea,
  MantineShadow,
  ThemeIcon,
  LoadingOverlay,
  Checkbox,
  // CheckIcon,
  Button,
  Alert
} from '@mantine/core'
import { useSet } from '@mantine/hooks'
import usePagination from 'hooks/usePagination'
import { useMemo, PropsWithChildren, ReactNode, useCallback, useState } from 'react'
import DownArrowIcon from 'resources/icons/DownArrow'
import Dots from 'resources/icons/TreeDotsMenu'

export type ColumnElement = {
  value?: string | number | bigint | undefined
  element?: string | ReactNode
  label?: string
}

export type DataElement = {
  id: string
  rowColor?: MantineColor
  actionData?: any
  columns: ColumnElement[]
}

export type TableRowAction = {
  action: (e: DataElement['actionData']) => any
  label: ((e: DataElement['actionData']) => string) | string
  color?: MantineColor
  icon?: ((e: DataElement['actionData']) => ReactNode) | ReactNode
  disabled?: (e?: DataElement['actionData']) => boolean
  hide?: (e?: DataElement['actionData']) => boolean
}

export type CustomTableProps = PropsWithChildren &
  TableProps & {
    headings: string[]
    data: DataElement[]
    pageSize?: number
    actions?: TableRowAction[]
    shadow?: MantineShadow
    loading?: boolean
    selectedActions?: TableRowAction[]
    tableActions?: ReactNode
    error?: string | boolean
    defaultSortIndex?: number
  }

const getLabel = (label: TableRowAction['label'], actionData?: DataElement['actionData']) => {
  if (typeof label === 'function') {
    return label(actionData)
  }

  return label
}

const getIcon = (icon: TableRowAction['icon'], actionData?: DataElement['actionData']) => {
  if (typeof icon === 'function') {
    return icon(actionData)
  }

  return icon
}

export const CustomTable = ({
  headings,
  data,
  pageSize,
  actions,
  shadow = 'none',
  loading,
  selectedActions,
  tableActions,
  error,
  defaultSortIndex,
  ...tableProps
}: CustomTableProps) => {
  const selectedElements = useSet<string>()
  const hasSelectActions = useMemo(() => !!selectedActions?.length, [selectedActions?.length])

  const maxItemsPerPage = pageSize || 10

  const {
    maxPages,
    page,
    startIndex,
    endIndex,
    onNextPage,
    onPreviousPage,
    onChange: setPage
  } = usePagination({
    elementsLength: data.length,
    maxItemsPerPage
  })

  const [sorting, setSorting] = useState<{ sortIndex: number; sortDirection: -1 | 1 }>({
    sortIndex: defaultSortIndex || -1,
    sortDirection: -1
  })

  const filteredData = useMemo(() => {
    const { sortIndex, sortDirection } = sorting

    console.log({ sortIndex })

    const next = [...data]
      .sort((a, b) => {
        if (sortIndex < 0) {
          return 0
        }

        const aVal = a.columns[sortIndex]?.value || 0
        const bVal = b.columns[sortIndex]?.value || 0

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * sortDirection
        }

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return (aVal - bVal) * sortDirection
        }
        if (typeof aVal === 'bigint' && typeof bVal === 'bigint') {
          return Number(aVal - bVal) * sortDirection
        }

        if (aVal > bVal) {
          return 1 * sortDirection
        }
        if (aVal < bVal) {
          return -1 * sortDirection
        }
        return 0
      })
      .slice(startIndex, endIndex)

    return next
  }, [sorting, data, startIndex, endIndex])

  const handleCheckbox = useCallback(
    (checked: boolean, id: string) => {
      selectedElements[checked ? 'add' : 'delete'](id || '')
    },
    [selectedElements]
  )

  const currentPageElementsAllSelected: boolean = useMemo(
    () => !!selectedElements.size && filteredData.every((x) => selectedElements.has(x.id || '')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filteredData, selectedElements, selectedElements.size]
  )

  const handleCheckboxMaster = useCallback(
    (all?: boolean) =>
      [...(all ? data : filteredData)].forEach((x) =>
        selectedElements[currentPageElementsAllSelected ? 'delete' : 'add'](x.id || '')
      ),
    [currentPageElementsAllSelected, data, filteredData, selectedElements]
  )

  const masterActionMenu = useMemo(() => {
    return hasSelectActions ? (
      <Group>
        {selectedActions?.map((a) => {
          const label = getLabel(a.label, selectedElements)

          return (
            <Tooltip key={label} label={label}>
              <Button
                size="sm"
                variant="light"
                color={a.color || 'mainText'}
                onClick={() => {
                  a.action(
                    Array.from(selectedElements.values()).map(
                      (id) => data.find((x) => x.id === id)?.actionData
                    )
                  )
                  selectedElements.clear()
                }}
                leftSection={getIcon(a.icon, selectedElements)}
              >
                {label}
              </Button>
            </Tooltip>
          )
        })}
      </Group>
    ) : null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSelectActions, selectedActions, selectedElements, selectedElements.size])

  const masterSelectAction = useMemo(
    () =>
      hasSelectActions && (
        <Checkbox
          size="sm"
          checked={currentPageElementsAllSelected}
          onChange={() => handleCheckboxMaster()}
        />
      ),
    [currentPageElementsAllSelected, handleCheckboxMaster, hasSelectActions]
  )

  const { rows, actionHeadings } = useMemo(() => {
    const tableRows = filteredData.map((rowData, index) => {
      const activeActions = [...(actions || [])].filter((a) => !a.hide?.(rowData.actionData))
      const maxActions = 3

      const actionsMenu = activeActions?.length ? (
        <Group justify="right" gap="sm" wrap="nowrap">
          {activeActions.slice(0, maxActions).map((a) => {
            const label = getLabel(a.label, rowData.actionData)
            return (
              <Tooltip key={label} label={label}>
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  color={a.color || 'mainText'}
                  onClick={() => a.action(rowData.actionData || rowData)}
                  disabled={a.disabled?.(rowData.actionData || rowData)}
                >
                  {getIcon(a.icon, rowData.actionData)}
                </ActionIcon>
              </Tooltip>
            )
          })}
          {activeActions.length > maxActions && (
            <Menu shadow="lg" withArrow>
              <Menu.Target>
                <ActionIcon size="23px" variant="transparent" color="mainText" component="div">
                  <Dots />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {activeActions.slice(maxActions).map((a) => {
                  const label = getLabel(a.label, rowData.actionData)
                  const disabled = a.disabled?.(rowData.actionData || rowData)
                  return (
                    <Menu.Item
                      color={a.color || 'mainText'}
                      key={label}
                      leftSection={
                        <ThemeIcon size="sm" variant="transparent" color={a.color || 'mainText'}>
                          {getIcon(a.icon, rowData.actionData)}
                        </ThemeIcon>
                      }
                      onClick={() => a.action(rowData.actionData || rowData)}
                      disabled={disabled}
                    >
                      {label}
                    </Menu.Item>
                  )
                })}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      ) : null

      const color = rowData.rowColor
      const rowKey = rowData.id?.toString() || index

      const cols = rowData.columns.map((column) => {
        const colElement = column?.element || column?.value?.toString()

        return typeof colElement !== 'object' ? (
          <Text ta="left" size="sm" truncate maw={200}>
            {colElement}
          </Text>
        ) : (
          colElement
        )
      })

      if (hasSelectActions) {
        cols.unshift(
          <Checkbox
            size="sm"
            aria-label="Select row"
            checked={selectedElements.has(rowData.id || '')}
            onChange={(el) => handleCheckbox(el.currentTarget.checked, rowData.id || '')}
          />
        )
      }

      if (activeActions && actionsMenu) {
        cols.push(actionsMenu)
      }

      return (
        <Table.Tr key={rowKey}>
          {cols.map((c, cidx) => (
            <Table.Td key={rowKey + cidx.toString()} c={color}>
              {c}
            </Table.Td>
          ))}
        </Table.Tr>
      )
    })

    const colHeadings: string[] = [...headings]
    let headingOffset = 0
    if (hasSelectActions) {
      colHeadings.unshift('select')
      headingOffset = -1
    }

    if (actions?.length) {
      colHeadings.push('actions')
    }

    return {
      rows: tableRows,
      actionHeadings: colHeadings.map((heading, index) => (
        <Table.Th tt="capitalize" key={heading} w="auto">
          {heading === 'select' ? (
            masterSelectAction
          ) : (
            <Group wrap="nowrap" gap="xs" align="center">
              {filteredData[0]?.columns[index]?.value !== undefined ? (
                <Button
                  px="0"
                  tt="capitalize"
                  variant="transparent"
                  size="xs"
                  c="mainText"
                  onClick={() => {
                    setSorting((prev) => ({
                      sortIndex: index + headingOffset,
                      sortDirection: prev.sortDirection < 0 ? 1 : -1
                    }))
                    setPage(1)
                  }}
                  rightSection={
                    sorting.sortIndex === index + headingOffset && (
                      <ActionIcon variant="transparent" c="mainText" size={14}>
                        <DownArrowIcon
                          style={{
                            transform: sorting.sortDirection > 0 ? 'rotate(180deg)' : undefined
                          }}
                        />
                      </ActionIcon>
                    )
                  }
                >
                  {heading}
                </Button>
              ) : (
                heading
              )}
            </Group>
          )}
        </Table.Th>
      ))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredData, actions, selectedElements, selectedElements.size, headings])

  return (
    <Stack align="stretch" w="100%" pos="relative" gap="sm">
      <LoadingOverlay visible={loading} />
      {error && (
        <Alert
          variant="outline"
          color="error"
          title={typeof error === 'string' ? error : 'Error loading data'}
        />
      )}

      {!error && !loading && !rows.length && (
        <Alert variant="outline" color="info" title="No data found" />
      )}

      {((!!selectedElements.size && !!masterActionMenu) || tableActions) && (
        <Group align="center" justify={selectedElements.size ? 'space-between' : 'right'}>
          {selectedElements.size && masterActionMenu}

          {tableActions}
        </Group>
      )}

      <Paper pb="md" w="100%" shadow={shadow}>
        <Stack justify="space-between" mih={420} gap="xl">
          <ScrollArea scrollbars="x" type="auto" offsetScrollbars>
            <Table {...tableProps} w="100%" highlightOnHover verticalSpacing="xs">
              <Table.Thead bg="alternativeBackground">
                <Table.Tr>{actionHeadings}</Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        </Stack>
      </Paper>

      <Group w="100%" justify="right" pr="md">
        <Pagination
          color="brand"
          total={maxPages}
          boundaries={1}
          value={page}
          // defaultValue={defaultPage}
          onNextPage={onNextPage}
          onPreviousPage={onPreviousPage}
          onChange={setPage}
          size="sm"
          styles={{
            control: {
              border: 0
            }
          }}
        />
      </Group>
    </Stack>
  )
}
