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
  MantineTheme,
  getPrimaryShade,
  Paper,
  ScrollArea,
  MantineShadow
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useMediaQuery, useColorScheme } from '@mantine/hooks'
import usePagination from 'hooks/usePagination'
import { useMemo, PropsWithChildren, ReactNode } from 'react'
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
  icon: ReactNode
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
  }

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    action: {
      '&:hover': {
        color: theme.colors.brand[primaryShade]
      }
    }
  }
})

const getLabel = (label: TableRowAction['label'], actionData: TableElement['actionData']) => {
  if (typeof label === 'function') {
    return label(actionData)
  }

  return label
}

export const CustomTable = ({
  headings,
  elements,
  pageSize,
  actions,
  shadow = 'none',
  ...tableProps
}: CustomTableProps) => {
  const isMobile = useMediaQuery('(max-width: 75rem)')

  const { classes } = useStyles()
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

  const rows = useMemo(() => {
    return list.map((e, i) => {
      const activeActions = [...(actions || [])].filter((a) => !a.hide?.(e.actionData))

      const actionsMenu = activeActions?.length && (
        <Group justify={isMobile ? 'center' : 'right'} gap="sm" wrap="nowrap">
          {activeActions.slice(0, 3).map((a) => {
            const label = getLabel(a.label, e.actionData)
            return (
              <Tooltip key={label} label={label}>
                <ActionIcon
                  size="23px"
                  variant="transparent"
                  color={a.color || 'dark'}
                  className={classes.action}
                  onClick={() => a.action(e.actionData || e)}
                  disabled={a.disabled?.(e.actionData || e)}
                >
                  {a.icon}
                </ActionIcon>
              </Tooltip>
            )
          })}
          {activeActions.length > 3 && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon
                  size="23px"
                  variant="transparent"
                  color="dark"
                  className={classes.action}
                  component="div"
                >
                  <Dots />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                {activeActions.slice(3).map((a) => {
                  const label = getLabel(a.label, e.actionData)
                  const disabled = a.disabled?.(e.actionData || e)
                  return (
                    <Menu.Item
                      color={a.color || 'dark'}
                      key={label}
                      leftSection={
                        <ActionIcon
                          size="23px"
                          variant="transparent"
                          color={a.color || 'dark'}
                          className={classes.action}
                          disabled={disabled}
                          component="div"
                        >
                          {a.icon}
                        </ActionIcon>
                      }
                      onClick={() => a.action(e.actionData || e)}
                      disabled={disabled}
                      className={classes.action}
                    >
                      <Text size="md">{label}</Text>
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

      const cols = columns.map((column, cidx) => {
        const columnParsed = column === 'status' ? e[column].element : e[column]
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
            <Text size="sm" c={color} truncate maw={200}>
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
  }, [list, actions, isMobile, classes.action, columns, headings])

  if (!elements.length) return <Text>No data found</Text>
  return (
    <Stack align="center" w="100%">
      <Paper pb="md" w="100%" shadow={shadow}>
        {isMobile ? (
          <Stack gap="xl">{rows}</Stack>
        ) : (
          <ScrollArea scrollbars="x" type="auto" offsetScrollbars>
            <Table {...tableProps} w="100%" highlightOnHover verticalSpacing="sm">
              <Table.Thead bg="alternativeBackground">
                <Table.Tr>
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
            total={maxPages}
            boundaries={1}
            defaultValue={defaultPage}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            onChange={(value) => onChange(value)}
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
