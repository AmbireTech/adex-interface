import {
  Flex,
  Group,
  Pagination,
  Table,
  Grid,
  Divider,
  Text,
  MantineTheme,
  getPrimaryShade
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useMediaQuery, useColorScheme } from '@mantine/hooks'
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
    },
    tableWrapper: {
      width: '100%',
      overflow: 'hidden',
      overflowX: 'auto'
    },
    mobileTableWrapper: {
      borderBottom: `1px solid ${theme.colors.decorativeBorders[primaryShade]}`,
      textAlign: 'center'
    },
    gridRow: { borderBottom: `1px solid ${theme.colors.decorativeBorders[primaryShade]}` },
    cell: {
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      maxWidth: 200
    }
  }
})

const CustomTable = ({
  background,
  headings,
  elements,
  pageSize,
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
  const maxItemsPerPage = pageSize || 10
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
          <Table.Th key={heading}>{heading}</Table.Th>
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
        <Table.Tr key={e.id}>
          {columns.map((column: string) => {
            const columnParsed = column === 'status' ? e[column].element : e[column]

            return (
              <Table.Td key={column} className={classes.cell}>
                {columnParsed}
              </Table.Td>
            )
          })}
          {hasAction && (
            <Table.Td>
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
            </Table.Td>
          )}
        </Table.Tr>
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
            <Table.Thead className={classes.header}>
              <Table.Tr>
                {head}
                {hasAction && <Table.Th key="Action">Action</Table.Th>}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
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

export default CustomTable
