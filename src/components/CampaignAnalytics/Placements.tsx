import { Campaign, CampaignStatus, Placement } from 'adex-common'
import CustomTable, { TableElement, TableRowAction } from 'components/common/CustomTable'
import { getHumneSrcName } from 'helpers'
import { useMemo } from 'react'
import { BaseAnalyticsData } from 'types'
import InvisibilityIcon from 'resources/icons/Invisibility'
import VisibilityIcon from 'resources/icons/Visibility'
import { useCampaignsData } from 'hooks/useCampaignsData'

const Placements = ({
  placements,
  currencyName,
  placement,
  campaign
}: {
  placements: BaseAnalyticsData[] | undefined
  currencyName: string
  placement: Placement
  campaign: Campaign
}) => {
  const { toggleBlockedSource } = useCampaignsData()

  if (!placements?.length) {
    return <div>No placement found</div>
  }

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

  const elements: PlacementsTableElement[] = useMemo(
    () =>
      placements?.map((item) => {
        const isBlocked = campaign.targetingInput.inputs.publishers.nin.includes(item.segment)
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
    [placements, campaign.targetingInput.inputs.publishers.nin, placement, currencyName]
  )

  const actions = useMemo(() => {
    const placementActions: TableRowAction[] = [
      CampaignStatus.active,
      CampaignStatus.paused
    ].includes(campaign.status)
      ? [
          {
            action: (props: PlacementsTableElement['actionData']) =>
              toggleBlockedSource(campaign.id, props.placementName, props.segment),
            label: ({ isBlocked, placementName }: PlacementsTableElement['actionData']) =>
              `${isBlocked ? 'Unblock' : 'Block'} "${placementName}"`,
            icon: ({ isBlocked }: PlacementsTableElement['actionData']) =>
              isBlocked ? <VisibilityIcon size="inherit" /> : <InvisibilityIcon size="inherit" />
          }
        ]
      : []

    return placementActions
  }, [campaign.id, campaign.status, toggleBlockedSource])

  return <CustomTable headings={headings} elements={elements} actions={actions} />
}

export default Placements
