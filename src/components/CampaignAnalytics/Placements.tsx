import { CampaignStatus } from 'adex-common'
import CustomTable, { DataElement, TableRowAction } from 'components/common/CustomTable'
import { getHumneSrcName } from 'helpers'
import { useCallback, useMemo } from 'react'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import { Group, ThemeIcon, Text } from '@mantine/core'
import DownloadCSV from 'components/common/DownloadCSV'
import BlockIcon from 'resources/icons/Block'

// type PlacementsTableElement = Omit<TableElement, 'actionData'> & {
//   actionData: {
//     srcId: string
//     isBlocked: boolean
//     srcName: string
//   }
//   id: string
//   placementName: string | ReactNode
//   impressions: string
//   clicks: string
//   ctr: string
//   avgCpm: string
//   paid: string
// }

const Placements = ({ forAdmin, campaignId }: { forAdmin: boolean; campaignId: string }) => {
  const { campaignMappedAnalytics, campaign, currencyName, loading, analyticsKey, error } =
    useCampaignsAnalyticsData({
      campaignId,
      forAdmin,
      analyticsType: 'hostname'
    })
  const { filterSources } = useCampaignsData()

  const placement = useMemo(
    () => campaign?.targetingInput.inputs.placements.in[0] || 'site',
    [campaign?.targetingInput.inputs.placements.in]
  )

  const headings = useMemo(
    () => [
      placement === 'app' ? 'App' : 'Website',
      'Impressions',
      'Clicks',
      'CTR',
      'Average CPM',
      'Spent'
    ],
    [placement]
  )

  const csvHeaders = useMemo(
    () => ({
      [placement === 'app' ? 'App' : 'Website']: 'segment',
      Impressions: 'impressions',
      Clicks: 'clicks',
      'CRT%': 'crt',
      Spent: 'paid',
      'Average CPM': 'avgCpm'
    }),
    [placement]
  )

  const elements: DataElement[] = useMemo(
    () =>
      !campaign?.id || !campaignMappedAnalytics
        ? []
        : campaignMappedAnalytics.map((item) => {
            const isBlocked = !!campaign.targetingInput.inputs.publishers.nin.includes(item.segment)
            const srcName = getHumneSrcName(item.segment, placement)
            const data: DataElement = {
              rowColor: isBlocked ? 'warning' : 'inherit',
              actionData: {
                srcName,
                isBlocked,
                srcId: item.segment
              },
              id: item.segment,
              columns: [
                {
                  element: isBlocked ? (
                    <Group align="center">
                      <ThemeIcon size="xs" variant="transparent" c="inherit">
                        <BlockIcon size="100%" />
                      </ThemeIcon>{' '}
                      <Text size="sm" c="inherit">
                        {srcName}
                      </Text>
                    </Group>
                  ) : (
                    srcName
                  )
                },
                { value: item.impressions.toLocaleString() },
                { value: item.clicks.toLocaleString() },
                { value: `${item.ctr} %` },
                { value: `${item.avgCpm} ${currencyName}` },
                { value: `${item.paid.toFixed(4)} ${currencyName}` }
              ]
            }

            return data
          }) || [],
    [
      campaign?.id,
      campaign?.targetingInput.inputs.publishers.nin,
      campaignMappedAnalytics,
      placement,
      currencyName
    ]
  )

  const filterSrc = useCallback(
    ({
      action,
      sources
    }: {
      action: 'include' | 'exclude'
      sources: { srcName: string; srcId: string }[]
    }) => {
      if (!campaign?.id) return
      filterSources(action, campaign?.id, sources)
    },
    [campaign?.id, filterSources]
  )

  const selectedActions = useMemo(() => {
    if (!campaign?.id) return []
    const placementActions: TableRowAction[] = [
      CampaignStatus.active,
      CampaignStatus.paused
    ].includes(campaign.status)
      ? [
          {
            action: (props: DataElement['actionData'][]) =>
              filterSrc({
                action: 'exclude',
                sources: props.map(({ srcId, srcName }) => ({
                  srcId,
                  srcName
                }))
              }),
            label: (selectedElements) => `Block selected (${selectedElements?.size})`,
            icon: (
              <ThemeIcon variant="transparent" size="xs">
                <BlockIcon size="14px" />
              </ThemeIcon>
            ),
            color: 'warning'
          },
          {
            action: (props: DataElement['actionData'][]) =>
              filterSrc({
                action: 'include',
                sources: props.map(({ srcId, srcName }) => ({
                  srcId,
                  srcName
                }))
              }),
            label: (selectedElements) => `Unblock selected (${selectedElements?.size})`,
            // icon: () => <VisibilityIcon size="10px" />,
            color: 'success'
          }
        ]
      : []

    return placementActions
  }, [campaign?.id, campaign?.status, filterSrc])

  return (
    <CustomTable
      error={error}
      headings={headings}
      data={elements}
      loading={loading}
      selectedActions={selectedActions}
      tableActions={
        <DownloadCSV
          data={campaignMappedAnalytics}
          mapHeadersToDataProperties={csvHeaders}
          filename={`${analyticsKey?.key}.csv`}
          disabled={loading}
        />
      }
    />
  )
}

export default Placements
