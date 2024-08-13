import { Campaign, CampaignStatus, Placement } from 'adex-common'
import CustomTable, { TableElement, TableRowAction } from 'components/common/CustomTable'
import { getHumneSrcName } from 'helpers'
import { useCallback, useMemo } from 'react'
import { BaseAnalyticsData } from 'types'
import { useAdExApi } from 'hooks/useAdexServices'
import useCustomNotifications from 'hooks/useCustomNotifications'
import InvisibilityIcon from 'resources/icons/Invisibility'
import VisibilityIcon from 'resources/icons/Visibility'

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
  const { adexServicesRequest } = useAdExApi()
  const { showNotification } = useCustomNotifications()
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

  const toggleBlocked = useCallback(
    async ({ placementName, isBlocked, segment }: PlacementsTableElement['actionData']) => {
      console.log({ placementName })

      const blockedPublishers: Campaign['targetingInput']['inputs']['publishers'] = {
        ...campaign.targetingInput.inputs.placements,
        apply: 'nin',
        nin: isBlocked
          ? [...campaign.targetingInput.inputs.placements.nin].filter((x) => x === segment)
          : [...campaign.targetingInput.inputs.placements.nin, segment]
      }

      const body: Pick<Campaign, 'pricingBounds' | 'targetingInput'> = {
        pricingBounds: { ...campaign.pricingBounds },
        targetingInput: {
          ...campaign.targetingInput,
          inputs: {
            ...campaign.targetingInput.inputs,
            publishers: blockedPublishers
          }
        }
      }
      try {
        await adexServicesRequest('backend', {
          route: `/dsp/campaigns/edit/${campaign.id}`,
          method: 'PUT',
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        showNotification(
          'info',
          placementName,
          `Successfully ${isBlocked ? 'unblocked' : 'blocked'}`
        )
        // updateCampaignDataById(campaign.id)
      } catch {
        return showNotification('error', "Couldn't update the Campaign data!")
      }
    },
    [
      adexServicesRequest,
      campaign.id,
      campaign.pricingBounds,
      campaign.targetingInput,
      showNotification
    ]
  )

  const actions = useMemo(() => {
    const placementActions: TableRowAction[] = [
      CampaignStatus.active,
      CampaignStatus.paused
    ].includes(campaign.status)
      ? [
          {
            action: (props: PlacementsTableElement['actionData']) => toggleBlocked(props),
            label: ({ isBlocked, placementName }: PlacementsTableElement['actionData']) =>
              `${isBlocked ? 'Unblock' : 'Block'} "${placementName}"`,
            icon: ({ isBlocked }: PlacementsTableElement['actionData']) =>
              isBlocked ? <VisibilityIcon size="inherit" /> : <InvisibilityIcon size="inherit" />
          }
        ]
      : []

    return placementActions
  }, [campaign.status, toggleBlocked])

  return <CustomTable headings={headings} elements={elements} actions={actions} />
}

export default Placements
