import {
  Group,
  Pagination,
  Table,
  Divider,
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
import { useSet, useMediaQuery } from '@mantine/hooks'
import usePagination from 'hooks/usePagination'
import { useMemo, PropsWithChildren, ReactNode, useCallback } from 'react'
import Dots from 'resources/icons/TreeDotsMenu'

export type ColumnElement = {
  value: string | number | boolean | Date | BigInt
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
  ...tableProps
}: CustomTableProps) => {
  const isMobile = useMediaQuery('(max-width: 75rem)')
  const selectedElements = useSet<string>()
  const hasSelectActions = useMemo(() => !!selectedActions?.length, [selectedActions?.length])

  const maxItemsPerPage = pageSize || (isMobile ? data.length : 10)
  const { maxPages, defaultPage, startIndex, endIndex, onNextPage, onPreviousPage, onChange } =
    usePagination({
      elementsLength: data.length,
      maxItemsPerPage
    })
  const list = useMemo(() => {
    return data.slice(startIndex, endIndex)
  }, [data, startIndex, endIndex])

  const handleCheckbox = useCallback(
    (checked: boolean, id: string) => {
      selectedElements[checked ? 'add' : 'delete'](id || '')
    },
    [selectedElements]
  )

  const currentPageElementsAllSelected: boolean = useMemo(
    () => !!selectedElements.size && list.every((x) => selectedElements.has(x.id || '')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, selectedElements, selectedElements.size]
  )

  const handleCheckboxMaster = useCallback(
    (all?: boolean) =>
      [...(all ? data : list)].forEach((x) =>
        selectedElements[currentPageElementsAllSelected ? 'delete' : 'add'](x.id || '')
      ),
    [currentPageElementsAllSelected, data, list, selectedElements]
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

  const colHeadings: string[] = useMemo(
    () => [...(hasSelectActions ? ['select'] : []), ...headings, ...(actions ? ['actions'] : [])],
    [actions, headings, hasSelectActions]
  )

  const rows = useMemo(() => {
    return list.map((rowData, index) => {
      const activeActions = [...(actions || [])].filter((a) => !a.hide?.(rowData.actionData))
      const maxActions = isMobile ? activeActions.length : 3

      const actionsMenu = activeActions?.length ? (
        <Group justify={isMobile ? 'auto' : 'right'} gap="sm" wrap="nowrap">
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
          {!isMobile && activeActions.length > maxActions && (
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

      const colsToMap = [
        // ...(hasSelectActions ? ['select'] : []),
        ...rowData.columns
        // ...(activeActions.length ? ['actions'] : [])
      ]

      const cols = rowData.columns.map((column, cidx) => {
        const colElement = column?.label

        const el =
          typeof colElement !== 'object' ? (
            <Text ta="left" size="sm" truncate maw={200}>
              {colElement}
            </Text>
          ) : (
            colElement
          )

        return isMobile ? (
          <Stack key={rowKey + cidx.toString()} gap="xs">
            <Group grow align="center" px="sm">
              <Text ta="left" tt="capitalize" fw="bold" size="sm">
                {headings[cidx]}:
              </Text>
              {el}
            </Group>
            <Divider hidden={cidx === colsToMap.length - 1} />
          </Stack>
        ) : (
          <Table.Td key={rowKey + cidx.toString()} c={color} miw="fit-content">
            {el}
          </Table.Td>
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

      if (isMobile) {
        return (
          <Paper key={rowKey} py="sm" shadow="xs">
            <Stack gap="xs" align="stretch" justify="center">
              {/* <Divider color="lightBackground" size={14} /> */}
              {cols}
            </Stack>
          </Paper>
        )
      }
      return <Table.Tr key={rowKey}>{cols}</Table.Tr>
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, actions, isMobile, selectedElements, selectedElements.size, headings])

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

      {isMobile ? (
        <Stack gap="xl">
          {hasSelectActions && (
            <Group align="center" justify="left" pt="xs">
              Select all: {masterSelectAction}
            </Group>
          )}
          {rows}
        </Stack>
      ) : (
        <Paper pb="md" w="100%" shadow={shadow}>
          <Stack justify="space-between" mih={420} gap="xl">
            <ScrollArea scrollbars="x" type="auto" offsetScrollbars>
              <Table {...tableProps} w="100%" highlightOnHover verticalSpacing="xs">
                <Table.Thead bg="alternativeBackground">
                  <Table.Tr>
                    {colHeadings.map((h) => (
                      <Table.Th tt="capitalize" key={h} w={h === 'select' ? 20 : 'auto'}>
                        {h === 'select' ? masterSelectAction : h}
                      </Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </ScrollArea>
            <Group w="100%" justify="right" pr="md">
              <Pagination
                color="brand"
                total={maxPages}
                boundaries={1}
                defaultValue={defaultPage}
                onNextPage={onNextPage}
                onPreviousPage={onPreviousPage}
                onChange={onChange}
                size="sm"
                styles={{
                  control: {
                    border: 0
                  }
                }}
              />
            </Group>
          </Stack>
        </Paper>
      )}
    </Stack>
  )
}
