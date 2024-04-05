import { Flex, Group, Pagination, Table, createStyles, Grid, Text, Divider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import VisibilityIcon from 'resources/icons/Visibility'
import { ICustomTableProps } from 'types'
import usePagination from 'hooks/usePagination'
import { useMemo } from 'react'
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
  }
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
  if (!elements.length) return <Text>No data found</Text>
  const isMobile = useMediaQuery('(max-width: 75rem)')
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
              <Grid style={{ borderBottom: '1px solid #33333333' }} m="1px 0" w="100%" key={column}>
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
  }, [isMobile, columns, list, hasAction, onPreview, onAnalytics, onDuplicate, onDelete])

  return (
    <Flex h="100%" justify="space-between" direction="column" align="center">
      {isMobile ? (
        <Grid mt="xs" style={{ borderBottom: '1px solid #33333330', textAlign: 'center' }}>
          {rows.map((row) => row)}
        </Grid>
      ) : (
        <Table
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
