import { CampaignStatus } from 'adex-common'
import CustomTable, { TableElement, TableRowAction } from 'components/common/CustomTable'
import { getHumneSrcName } from 'helpers'
import { useMemo } from 'react'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import { Stack, Group } from '@mantine/core'
import DownloadCSV from 'components/common/DownloadCSV'
import VisibilityIcon from 'resources/icons/Visibility'
import InvisibilityIcon from 'resources/icons/Invisibility'

type PlacementsTableElement = Omit<TableElement, 'actionData'> & {
  actionData: {
    placementName: string
    isBlocked: boolean
    segment: string
  }
  id: string
  placementName: string
  impressions: string
  clicks: string
  ctr: string
  avgCpm: string
  paid: string
}

const Placements = ({ forAdmin, campaignId }: { forAdmin: boolean; campaignId: string }) => {
  const { campaignMappedAnalytics, campaign, currencyName, loading, analyticsKey } =
    useCampaignsAnalyticsData({
      campaignId,
      forAdmin,
      analyticsType: 'hostname'
    })
  const { toggleBlockedSource, addOrRemoveSources } = useCampaignsData()

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

  const elements: PlacementsTableElement[] = useMemo(
    () =>
      !campaign?.id || !campaignMappedAnalytics
        ? []
        : campaignMappedAnalytics.map((item) => {
            const isBlocked = !!campaign.targetingInput.inputs.publishers.nin.includes(item.segment)
            const placementName = getHumneSrcName(item.segment, placement)
            const data: PlacementsTableElement = {
              rowColor: isBlocked ? 'red' : 'inherit',
              actionData: {
                placementName,
                isBlocked,
                segment: item.segment
              },
              id: item.segment,
              placementName,
              impressions: item.impressions.toLocaleString(),
              clicks: item.clicks.toLocaleString(),
              ctr: `${item.ctr} %`,
              avgCpm: `${item.avgCpm} ${currencyName}`,
              paid: `${item.paid.toFixed(4)} ${currencyName}`
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

  const actions = useMemo(() => {
    if (!campaign?.id) return []
    const placementActions: TableRowAction[] = [
      CampaignStatus.active,
      CampaignStatus.paused
    ].includes(campaign.status)
      ? [
          {
            action: (props: PlacementsTableElement['actionData']) =>
              toggleBlockedSource(campaign?.id, props.placementName, props.segment),
            label: ({ isBlocked, placementName }: PlacementsTableElement['actionData']) =>
              `${isBlocked ? 'Unblock' : 'Block'} "${placementName}"`,
            icon: ({ isBlocked }: PlacementsTableElement['actionData']) =>
              isBlocked ? <VisibilityIcon /> : <InvisibilityIcon />
          }
        ]
      : []

    return placementActions
  }, [campaign, toggleBlockedSource])

  const selectedActions = useMemo(() => {
    if (!campaign?.id) return []
    const placementActions: TableRowAction[] = [
      CampaignStatus.active,
      CampaignStatus.paused
    ].includes(campaign.status)
      ? [
          {
            action: (props) =>
              addOrRemoveSources(
                'block',
                campaign?.id,
                props.map((x: any) => ({
                  srcId: x,
                  srcName: x
                }))
              ),
            label: (selectedElements) => `Block selected ${selectedElements?.size}`,
            icon: () => <VisibilityIcon size="10px" />,
            color: 'warning'
          },
          {
            action: (props) =>
              addOrRemoveSources(
                'unblock',
                campaign?.id,
                props.map((x: any) => ({
                  srcId: x,
                  srcName: x
                }))
              ),
            label: (selectedElements) => `Unblock selected ${selectedElements?.size}`,
            icon: () => <InvisibilityIcon size="10px" />,
            color: 'brand'
          }
        ]
      : []

    return placementActions
  }, [campaign, addOrRemoveSources])

  return (
    <Stack gap="xs">
      <Group align="center" justify="end">
        <DownloadCSV
          data={campaignMappedAnalytics}
          mapHeadersToDataProperties={csvHeaders}
          filename={`${analyticsKey?.key}.csv`}
          disabled={loading}
        />
      </Group>
      <CustomTable
        headings={headings}
        elements={elements}
        actions={actions}
        loading={loading}
        selectedActions={selectedActions}
      />
    </Stack>
  )
}

export default Placements
