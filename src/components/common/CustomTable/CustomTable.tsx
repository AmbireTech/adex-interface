import { Flex, Group, Pagination, Table, createStyles, Grid, Divider, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import VisibilityIcon from 'resources/icons/Visibility'
import { ICustomTableProps } from 'types'
import usePagination from 'hooks/usePagination'
import { Fragment, useMemo } from 'react'
import AnalyticsIcon from 'resources/icons/Analytics'
import DuplicateIcon from 'resources/icons/Duplicate'
import DeleteIcon from 'resources/icons/Delete'
import ActionButton from './ActionButton/ActionButton'

const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors.alternativeBackground[theme.fn.primaryShade()]
  },
  border: {
    borderRadius: theme.radius.md,
    overflow: 'hidden'
  },
  background: {
    backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
    boxShadow: theme.shadows.xs
  },
  tableWrapper: {
    width: '100%',
    overflow: 'hidden',
    overflowX: 'auto'
  },
  mobileTableWrapper: { borderBottom: '1px solid #33333333', textAlign: 'center' },
  gridRow: { borderBottom: '1px solid #33333333' }
}))

const CustomTable = ({
  background,
  headings,
  elements,
  onPreview,
  onAnalytics,
  onDuplicate,
  onDelete
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
    () =>
      headings.map((heading) =>
        isMobile ? (
          <Grid.Col span={6} key={heading}>
            {heading}
          </Grid.Col>
        ) : (
          <th key={heading}>{heading}</th>
        )
      ),
    [isMobile, headings]
  )

  const hasAction = !!onPreview || !!onAnalytics || !!onDuplicate || !!onDelete

  const rows = useMemo(() => {
    if (isMobile)
      return list.map((e) => (
        <>
          <Divider bg="#EBEEFA" m="1px 0" w="100%" p="15px" />
          {columns.map((column, i) => {
            return (
              <Grid className={classes.gridRow} m="1px 0" w="100%" key={column}>
                {head[i]}

                <Grid.Col span={6}>
                  {typeof e[column] === 'object' &&
                  typeof e[column].from === 'string' &&
                  typeof e[column].to === 'string'
                    ? `${e[column].from} - ${e[column].to}`
                    : e[column]}
                </Grid.Col>
              </Grid>
            )
          })}
          {hasAction && (
            <Grid.Col span={12}>
              <Flex justify="center" mb="2rem">
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
              </Flex>
            </Grid.Col>
          )}
        </>
      ))
    return list.map((e) => (
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
    ))
  }, [
    isMobile,
    list,
    columns,
    hasAction,
    onPreview,
    onAnalytics,
    onDuplicate,
    onDelete,
    classes.gridRow,
    head
  ])

  if (!elements.length) return <Text>No data found</Text>
  return (
    <Flex h="100%" w="100%" justify="space-between" direction="column" align="center">
      {isMobile ? (
        <Grid mt="xs" className={classes.mobileTableWrapper}>
          {rows.map((row, idx) => (
            // eslint-disable-next-line react/no-array-index-key
            <Fragment key={idx}>{row}</Fragment>
          ))}
        </Grid>
      ) : (
        <div className={classes.tableWrapper}>
          <Table
            miw="max-content"
            w="100%"
            highlightOnHover
            verticalSpacing={15}
            className={cx(classes.border, { [classes.background]: background })}
          >
            <thead className={classes.header}>
              <tr>
                {head}
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
