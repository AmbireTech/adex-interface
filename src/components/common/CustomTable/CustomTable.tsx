import {
  Flex,
  Group,
  Pagination,
  Table,
  createStyles,
  Divider,
  Text,
  Stack,
  Menu,
  ActionIcon,
  TableProps,
  MantineColor,
  Tooltip
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
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
  icon: ReactNode
  disabled?: (e?: TableElement['actionData']) => boolean
}

export type CustomTableProps = PropsWithChildren &
  TableProps & {
    background?: boolean
    headings: string[]
    elements: Array<TableElement>
    pageSize?: number
    actions?: TableRowAction[]
  }

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.alternativeBackground[theme.fn.primaryShade()]
  },
  background: {
    backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
    boxShadow: theme.shadows.xs
  },
  tableWrapper: {
    width: '100%',
    overflow: 'hidden',
    overflowX: 'auto',
    borderRadius: theme.radius.md
  },
  gridRow: { borderBottom: `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}` },
  cell: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: 200
  },
  action: {
    '&:hover': {
      color: theme.colors.brand[theme.fn.primaryShade()]
    }
  }
}))

const getLabel = (label: TableRowAction['label'], actionData: TableElement['actionData']) => {
  if (typeof label === 'function') {
    return label(actionData)
  }

  return label
}

export const CustomTable = ({
  background,
  headings,
  elements,
  pageSize,
  actions,
  ...tableProps
}: CustomTableProps) => {
  const isMobile = useMediaQuery('(max-width: 75rem)')

  const { classes, cx } = useStyles()
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
      const actionsMenu = actions?.length && (
        <Group position={isMobile ? 'center' : 'right'} w="100%" spacing="xl">
          {actions.slice(0, 3).map((x) => {
            const label = getLabel(x.label, e.actionData)
            return (
              <Tooltip key={label} label={label}>
                <ActionIcon
                  variant="transparent"
                  color="dark"
                  onClick={() => x.action(e.actionData || e)}
                  className={classes.action}
                  disabled={x.disabled?.(e.actionData || e)}
                >
                  {x.icon}
                </ActionIcon>
              </Tooltip>
            )
          })}
          {actions.length > 3 && (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <ActionIcon variant="transparent" color="dark" className={classes.action}>
                  <Dots size="20px" />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Label>More actions</Menu.Label>
                {actions.slice(3).map((x) => {
                  const label = getLabel(x.label, e.actionData)
                  return (
                    <Menu.Item
                      key={label}
                      icon={x.icon}
                      onClick={() => x.action(e.actionData || e)}
                      disabled={x.disabled?.(e.actionData || e)}
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
          <Stack key={rowKey + column} align="stretch" justify="center" spacing="xs">
            <Group grow>
              <Text align="center">{headings[cidx]}</Text>

              <Text align="center" truncate color={color}>
                {columnParsed}
              </Text>
            </Group>
            <Divider />
          </Stack>
        ) : (
          <td key={column} className={classes.cell}>
            <Text color={color} truncate>
              {columnParsed}
            </Text>
          </td>
        )
      })

      if (isMobile) {
        return (
          <Stack key={rowKey} spacing="xs" align="stretch" justify="center">
            <Divider bg="#EBEEFA" w="100%" p="10px" />
            {cols}
            {actionsMenu}
          </Stack>
        )
      }
      return (
        <tr key={rowKey}>
          {cols}
          {actionsMenu && <td>{actionsMenu}</td>}
        </tr>
      )
    })
  }, [list, actions, isMobile, columns, headings, classes.cell])

  if (!elements.length) return <Text>No data found</Text>
  return (
    <Flex h="100%" w="100%" justify="space-between" direction="column" align="stretch">
      {isMobile ? (
        <Stack spacing="xl">{rows}</Stack>
      ) : (
        <div className={classes.tableWrapper}>
          <Table
            {...tableProps}
            miw="max-content"
            w="100%"
            highlightOnHover
            verticalSpacing={15}
            className={cx({ [classes.background]: background })}
          >
            <thead className={classes.header}>
              <tr>
                {headings.map((h) => (
                  <th key={h}>{h}</th>
                ))}
                {!!actions?.length && <th key="Action">Actions</th>}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </div>
      )}
      <Group w="100%" position="right" mt="xl">
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
