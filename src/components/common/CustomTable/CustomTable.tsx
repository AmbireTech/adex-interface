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
  Button
} from '@mantine/core'
import { useSet, useMediaQuery } from '@mantine/hooks'
import usePagination from 'hooks/usePagination'
import { useMemo, PropsWithChildren, ReactNode, useCallback } from 'react'
import Dots from 'resources/icons/TreeDotsMenu'

export type TableElement = {
  id?: string
  rowColor?: MantineColor
  actionData?: any
  [index: string]: any
}

export type TableRowAction = {
  action: (e: TableElement['actionData']) => any
  label: ((e: TableElement['actionData']) => string) | string
  color?: MantineColor
  icon?: ((e: TableElement['actionData']) => ReactNode) | ReactNode
  disabled?: (e?: TableElement['actionData']) => boolean
  hide?: (e?: TableElement['actionData']) => boolean
}

export type CustomTableProps = PropsWithChildren &
  TableProps & {
    headings: string[]
    elements: Array<TableElement>
    pageSize?: number
    actions?: TableRowAction[]
    shadow?: MantineShadow
    loading?: boolean
    selectedActions?: TableRowAction[]
    tableActions?: ReactNode
  }

const getLabel = (label: TableRowAction['label'], actionData?: TableElement['actionData']) => {
  if (typeof label === 'function') {
    return label(actionData)
  }

  return label
}

const getIcon = (icon: TableRowAction['icon'], actionData?: TableElement['actionData']) => {
  if (typeof icon === 'function') {
    return icon(actionData)
  }

  return icon
}

export const CustomTable = ({
  headings,
  elements,
  pageSize,
  actions,
  shadow = 'none',
  loading,
  selectedActions,
  tableActions,
  ...tableProps
}: CustomTableProps) => {
  const isMobile = useMediaQuery('(max-width: 75rem)')
  const selectedElemets = useSet<string>()

  const columns: string[] = useMemo(
    () =>
      typeof elements[0] === 'object'
        ? Object.keys(elements[0]).filter(
            (e: string) => e !== 'id' && e !== 'rowColor' && e !== 'actionData'
          )
        : [],
    [elements]
  )
  const maxItemsPerPage = pageSize || 10
  const { maxPages, defaultPage, startIndex, endIndex, onNextPage, onPreviousPage, onChange } =
    usePagination({
      elementsLength: elements.length,
      maxItemsPerPage
    })
  const list = useMemo(() => {
    return elements.slice(startIndex, endIndex)
  }, [elements, startIndex, endIndex])

  const handleCheckbox = useCallback(
    (checked: boolean, id: string) => {
      selectedElemets[checked ? 'add' : 'delete'](id || '')
    },
    [selectedElemets]
  )

  const currentPageElementsAllSelected = useMemo(
    () => list.every((x) => selectedElemets.has(x.id || '')),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list, selectedElemets, selectedElemets.size]
  )

  const handleCheckboxMaster = useCallback(
    (all?: boolean) => {
      ;(all ? elements : list).forEach((x) =>
        selectedElemets[currentPageElementsAllSelected ? 'delete' : 'add'](x.id || '')
      )
    },
    [currentPageElementsAllSelected, elements, list, selectedElemets]
  )

  const masterActionMenu = useMemo(() => {
    return (
      <Group>
        {selectedActions?.map((a) => {
          const label = getLabel(a.label, selectedElemets)

          return (
            <Tooltip key={label} label={label}>
              <Button
                size="sm"
                variant="light"
                color={a.color || 'mainText'}
                onClick={() => {
                  a.action(
                    Array.from(selectedElemets.values()).map(
                      (id) => elements.find((x) => x.id === id)?.actionData
                    )
                  )
                  selectedElemets.clear()
                }}
                leftSection={getIcon(a.icon, selectedElemets)}
              >
                {label}
              </Button>
            </Tooltip>
          )
        })}
      </Group>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActions, selectedElemets, selectedElemets.size])

  const masterSelectAction = useMemo(
    () =>
      selectedActions && (
        <Checkbox checked={currentPageElementsAllSelected} onClick={() => handleCheckboxMaster()} />
      ),
    [currentPageElementsAllSelected, handleCheckboxMaster, selectedActions]
  )

  const rows = useMemo(() => {
    return list.map((e, i) => {
      const activeActions = [...(actions || [])].filter((a) => !a.hide?.(e.actionData))
      const maxActions = isMobile ? activeActions.length : 3

      const actionsMenu = activeActions?.length && (
        <Group justify={isMobile ? 'center' : 'right'} gap="sm" wrap="nowrap">
          {activeActions.slice(0, maxActions).map((a) => {
            const label = getLabel(a.label, e.actionData)
            return (
              <Tooltip key={label} label={label}>
                <ActionIcon
                  size="23px"
                  variant="transparent"
                  color={a.color || 'mainText'}
                  onClick={() => a.action(e.actionData || e)}
                  disabled={a.disabled?.(e.actionData || e)}
                >
                  {getIcon(a.icon, e.actionData)}
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
                  const label = getLabel(a.label, e.actionData)
                  const disabled = a.disabled?.(e.actionData || e)
                  return (
                    <Menu.Item
                      color={a.color || 'mainText'}
                      key={label}
                      leftSection={
                        <ThemeIcon size="20px" variant="transparent" color={a.color || 'mainText'}>
                          {getIcon(a.icon, e.actionData)}
                        </ThemeIcon>
                      }
                      onClick={() => a.action(e.actionData || e)}
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
      )

      const color = e.rowColor
      const rowKey = e.id?.toString() || i

      const cols = [...(selectedActions ? ['select'] : []), ...columns].map((column, cidx) => {
        const columnParsed =
          e[column]?.element ||
          e[column] ||
          (column === 'select' && (
            <Checkbox
              checked={selectedElemets.has(e.id || '')}
              onChange={(el) => handleCheckbox(el.currentTarget.checked, e.id || '')}
            />
          ))

        return isMobile ? (
          <Stack key={rowKey + column} align="stretch" justify="center" gap="xs">
            <Group grow>
              <Text ta="center">{headings[cidx]}</Text>

              <Text ta="center" truncate c={color}>
                {columnParsed}
              </Text>
            </Group>
            <Divider />
          </Stack>
        ) : (
          <Table.Td key={column}>
            <Text size="sm" c={color} truncate maw={290}>
              {columnParsed}
            </Text>
          </Table.Td>
        )
      })

      if (isMobile) {
        return (
          <Stack key={rowKey} gap="xs" align="stretch" justify="center">
            <Divider bg="#EBEEFA" w="100%" p="10px" />
            {cols}
            {!!actionsMenu && actionsMenu}
          </Stack>
        )
      }
      return (
        <Table.Tr key={rowKey}>
          {cols}
          {!!actionsMenu && <Table.Td>{actionsMenu}</Table.Td>}
        </Table.Tr>
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, actions, isMobile, columns, selectedElemets, selectedElemets.size, headings])

  return (
    <Stack align="stretch" w="100%" pos="relative">
      <LoadingOverlay visible={loading} />
      <Group align="center" justify={selectedElemets.size ? 'space-between' : 'right'}>
        {selectedElemets.size && masterActionMenu}
        {tableActions}
      </Group>
      <Paper pb="md" w="100%" shadow={shadow}>
        {isMobile ? (
          <Stack gap="xl">
            {selectedActions && (
              <Group align="center" justify="center" pt="xs">
                Select current page: {masterSelectAction}
              </Group>
            )}
            {rows}
          </Stack>
        ) : (
          <ScrollArea scrollbars="x" type="auto" offsetScrollbars>
            <Table {...tableProps} mih={420} w="100%" highlightOnHover verticalSpacing="sm">
              <Table.Thead bg="alternativeBackground">
                <Table.Tr>
                  {selectedActions && <Table.Th maw={20}>{masterSelectAction}</Table.Th>}
                  {headings.map((h) => (
                    <Table.Th key={h}>{h}</Table.Th>
                  ))}
                  {!!actions?.length && <th key="Action">Actions</th>}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </ScrollArea>
        )}
        <Group w="100%" justify="right" mt="xl" pr="md">
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
      </Paper>
    </Stack>
  )
}
