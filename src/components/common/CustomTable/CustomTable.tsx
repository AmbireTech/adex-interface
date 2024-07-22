import {
  Flex,
  Group,
  Pagination,
  Table,
  createStyles,
  Divider,
  Text,
  SimpleGrid,
  Center
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import VisibilityIcon from 'resources/icons/Visibility'
import { ICustomTableProps } from 'types'
import usePagination from 'hooks/usePagination'
import { Fragment, useMemo } from 'react'
import AnalyticsIcon from 'resources/icons/Analytics'
import DuplicateIcon from 'resources/icons/Duplicate'
import DeleteIcon from 'resources/icons/Delete'
import { CampaignStatus } from 'adex-common'
import EditIcon from 'resources/icons/Edit'
import ActionButton from './ActionButton/ActionButton'

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
  }
}))

const CustomTable = ({
  background,
  headings,
  elements,
  pageSize,
  onPreview,
  onAnalytics,
  onDuplicate,
  onDelete,
  onEdit,
  ...tableProps
}: ICustomTableProps) => {
  const isMobile = useMediaQuery('(max-width: 75rem)')

  const { classes, cx } = useStyles()
  const columns: string[] = useMemo(
    () =>
      typeof elements[0] === 'object'
        ? Object.keys(elements[0]).filter((e: string) => e !== 'id')
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

  const hasAction = !!onPreview || !!onAnalytics || !!onDuplicate || !!onDelete || !!onEdit

  const rows = useMemo(() => {
    return list.map((e) => {
      const isDraftCampaign = e.status?.value === CampaignStatus.draft

      const actions = hasAction && (
        <Group position={isMobile ? 'center' : 'left'} w="100%">
          {!!onPreview && (
            <ActionButton
              title="View PDF"
              icon={<VisibilityIcon size="20px" />}
              action={() => onPreview(e)}
            />
          )}
          {!!onAnalytics && !isDraftCampaign && (
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
          {!!onEdit && isDraftCampaign && (
            <ActionButton title="Edit" icon={<EditIcon size="20px" />} action={() => onEdit(e)} />
          )}
        </Group>
      )

      const cols = columns.map((column, i) => {
        const columnParsed = column === 'status' ? e[column].element : e[column]
        return isMobile ? (
          <>
            <Group key={column} grow>
              <Center>{headings[i]}</Center>
              <Center>
                <Text truncate>{columnParsed}</Text>
              </Center>
            </Group>
            <Divider />
          </>
        ) : (
          <td key={column} className={classes.cell}>
            {columnParsed}
          </td>
        )
      })

      if (isMobile) {
        return (
          <SimpleGrid cols={1} verticalSpacing="xs" w="100%">
            <Divider bg="#EBEEFA" w="100%" p="10px" />
            {cols}
            {actions}
          </SimpleGrid>
        )
      }
      return (
        <tr key={e.id}>
          {cols}
          {actions && <td>{actions}</td>}
        </tr>
      )
    })
  }, [
    list,
    hasAction,
    isMobile,
    onPreview,
    onAnalytics,
    onDuplicate,
    onDelete,
    onEdit,
    columns,
    classes.cell,
    headings
  ])

  if (!elements.length) return <Text>No data found</Text>
  return (
    <Flex h="100%" w="100%" justify="space-between" direction="column" align="center">
      {isMobile ? (
        <SimpleGrid verticalSpacing="md" cols={1} w="100%">
          {rows.map((row, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={idx}>{row}</Fragment>
          ))}
        </SimpleGrid>
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
                {hasAction && <th key="Action">Action</th>}
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

export default CustomTable
