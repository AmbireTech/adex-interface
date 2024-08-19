import { CampaignStatus } from 'adex-common'
import CustomTable, { TableElement, TableRowAction } from 'components/common/CustomTable'
import { getHumneSrcName } from 'helpers'
import {
  ReactNode,
  //  useCallback,
  useMemo
} from 'react'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import { Group, ThemeIcon } from '@mantine/core'
import DownloadCSV from 'components/common/DownloadCSV'
// import VisibilityIcon from 'resources/icons/Include'
import BlockIcon from 'resources/icons/Block'
// import throttle from 'lodash.throttle'

type PlacementsTableElement = Omit<TableElement, 'actionData'> & {
  actionData: {
    placementName: string
    isBlocked: boolean
    segment: string
  }
  id: string
  placementName: string | ReactNode
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
              placementName: (
                <Group align="center">
                  {isBlocked && (
                    <ThemeIcon size="xs" variant="transparent" c="inherit">
                      <BlockIcon size="inherit" />
                    </ThemeIcon>
                  )}{' '}
                  {placementName}
                </Group>
              ),
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

  // const filterSrc = useCallback(
  //   ({
  //     action,
  //     sources
  //   }: {
  //     action: 'include' | 'exclude'
  //     sources: { srcName: string; srcId: string }[]
  //   }) => {
  //     if (!campaign?.id) return
  //     filterSources(action, campaign?.id, sources)
  //   },
  //   [campaign?.id, filterSources]
  // )

  // const throttledFilter = useMemo(() => throttle(filterSrc, 420, { trailing: false }), [filterSrc])

  const selectedActions = useMemo(() => {
    if (!campaign?.id) return []
    const placementActions: TableRowAction[] = [
      CampaignStatus.active,
      CampaignStatus.paused
    ].includes(campaign.status)
      ? [
          {
            action: (props) =>
              filterSources(
                'exclude',
                campaign?.id,
                props.map((x: any) => ({
                  srcId: x,
                  srcName: x
                }))
              ),
            label: (selectedElements) => `Block selected ${selectedElements?.size}`,
            icon: (
              <ThemeIcon variant="transparent" size="xs">
                <BlockIcon size="inherit" />
              </ThemeIcon>
            ),
            color: 'warning'
          },
          {
            action: (props) =>
              filterSources(
                'include',
                campaign?.id,
                props.map((x: any) => ({
                  srcId: x,
                  srcName: x
                }))
              ),
            label: (selectedElements) => `Unblock selected ${selectedElements?.size}`,
            // icon: () => <VisibilityIcon size="10px" />,
            color: 'success'
          }
        ]
      : []

    return placementActions
  }, [campaign, filterSources])

  return (
    <CustomTable
      headings={headings}
      elements={elements}
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
