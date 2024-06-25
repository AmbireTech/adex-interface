import { Flex, Group, Pagination, Table, createStyles, Grid, Divider, Text } from '@mantine/core'
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
  mobileTableWrapper: {
    borderBottom: `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`,
    textAlign: 'center'
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
  onPreview,
  onAnalytics,
  onDuplicate,
  onDelete,
  onEdit
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

  const hasAction = !!onPreview || !!onAnalytics || !!onDuplicate || !!onDelete || !!onEdit

  const rows = useMemo(() => {
    if (isMobile)
      return list.map((e) => {
        const isDraftCampaign = e.status?.value === CampaignStatus.draft
        return (
          <>
            <Divider bg="#EBEEFA" m="1px 0" w="100%" p="15px" />
            {columns.map((column, i) => {
              const columnParsed = column === 'status' ? e[column].element : e[column]
              return (
                <Grid className={classes.gridRow} m="1px 0" w="100%" key={column}>
                  {head[i]}

                  <Grid.Col span={6}>{columnParsed}</Grid.Col>
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
                    <ActionButton
                      title="Edit"
                      icon={<EditIcon size="20px" />}
                      action={() => onEdit(e)}
                    />
                  )}
                </Flex>
              </Grid.Col>
            )}
          </>
        )
      })
    return list.map((e) => {
      const isDraftCampaign = e.status?.value === CampaignStatus.draft
      return (
        <tr key={e.id}>
          {columns.map((column: string) => {
            const columnParsed = column === 'status' ? e[column].element : e[column]

            return (
              <td key={column} className={classes.cell}>
                {columnParsed}
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
                  <ActionButton
                    title="Edit"
                    icon={<EditIcon size="20px" />}
                    action={() => onEdit(e)}
                  />
                )}
              </Group>
            </td>
          )}
        </tr>
      )
    })
  }, [
    isMobile,
    list,
    columns,
    hasAction,
    onPreview,
    onAnalytics,
    onDuplicate,
    onDelete,
    onEdit,
    classes.gridRow,
    classes.cell,
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
