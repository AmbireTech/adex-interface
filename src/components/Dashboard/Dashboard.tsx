import {
  Campaign,
  CampaignStatus,
  // CampaignType,
  EventType
} from 'adex-common'
import { Container, Flex, Text, Loader, UnstyledButton } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CustomTable, { TableElement, TableRowAction } from 'components/common/CustomTable'
import { periodNumberToDate } from 'helpers'
import { useNavigate } from 'react-router-dom'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { modals } from '@mantine/modals'
import VisibilityIcon from 'resources/icons/Visibility'
import AnalyticsIcon from 'resources/icons/Analytics'
import DuplicateIcon from 'resources/icons/Duplicate'
import DeleteIcon from 'resources/icons/Delete'
import EditIcon from 'resources/icons/Edit'

import BadgeStatusCampaign from './BadgeStatusCampaign'

const campaignHeaders = [
  'Name',
  // 'Model',
  'Placement',
  'Status',
  'Served',
  'Budget',
  'Impressions',
  'Clicks',
  'CTR',
  'Period',
  'CPM'
]

const statusOrder = {
  inReview: 0,
  draft: 1,
  other: 2
}

const getStatusOrder = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.inReview:
      return statusOrder.inReview
    case CampaignStatus.draft:
      return statusOrder.draft
    default:
      return statusOrder.other
  }
}

type DashboardTableElement = Omit<TableElement, 'actionData'> & {
  actionData: { campaign: Campaign; isDraft: boolean; canArchive: boolean }
  title: string
  placement: string
  status: {
    value: CampaignStatus
    element: JSX.Element
  }
  served: string
  budget: string
  impressions: number
  clicks: number
  ctr: string
  period: JSX.Element
  cpm: JSX.Element
}

const Dashboard = ({ isAdminPanel, accountId }: { isAdminPanel?: boolean; accountId?: string }) => {
  const navigate = useNavigate()
  const {
    campaignsData,
    initialDataLoading,
    updateAllCampaignsData,
    deleteDraftCampaign,
    toggleArchived
  } = useCampaignsData()
  const { updateCampaignFromDraft } = useCreateCampaignContext()
  const { showNotification } = useCustomNotifications()

  const [showArchived, setShowArchived] = useState(false)
  const filteredCampaignData = useMemo(() => {
    let archivedCount = 0
    const campaignData = Array.from(campaignsData.values())
      .filter((x) => {
        const matchFilter =
          isAdminPanel && accountId
            ? x.campaign.owner.toLowerCase() === accountId.toLowerCase()
            : true

        const isArchived = x.campaign.archived
        if (isArchived) archivedCount++

        return matchFilter && (!isArchived || showArchived)
      })
      .sort((a, b) => {
        const statusOrderDiff =
          getStatusOrder(a.campaign.status) - getStatusOrder(b.campaign.status)
        if (statusOrderDiff !== 0) {
          return statusOrderDiff
        }
        return Number(b.campaign.created) - Number(a.campaign.created)
      })

    return {
      archivedCount,
      campaignData
    }
  }, [campaignsData, isAdminPanel, accountId, showArchived])

  const elements: DashboardTableElement[] = useMemo(
    () =>
      filteredCampaignData.campaignData.length
        ? filteredCampaignData.campaignData.map((cmpData) => {
            const campaign = cmpData.campaign
            const decimals = cmpData.campaign.outpaceAssetDecimals
            const budget = parseBigNumTokenAmountToDecimal(
              cmpData.campaign.campaignBudget,
              decimals
            )

            return {
              actionData: {
                campaign,
                isDraft: campaign.status === CampaignStatus.draft,
                canArchive: [
                  CampaignStatus.closedByUser,
                  CampaignStatus.exhausted,
                  CampaignStatus.expired,
                  CampaignStatus.rejected
                ].includes(campaign.status)
              },
              rowColor: cmpData.campaign.archived ? 'red' : undefined,
              id: cmpData.campaignId,
              title: `${cmpData.campaign.archived ? 'Archived - ' : ''}${cmpData.campaign.title}`,
              // type: CampaignType[cmpData.campaign.type],
              placement:
                cmpData.campaign.targetingInput.inputs.placements.in[0] === 'app'
                  ? 'App'
                  : 'Website',
              status: {
                value: cmpData.campaign.status,
                element: <BadgeStatusCampaign type={cmpData.campaign.status} />
              },
              served:
                cmpData.paid && budget ? `${Math.round((cmpData.paid / budget) * 100)} %` : '0 %',
              // TODO: get token name
              budget: `${budget} USDC`,
              impressions: cmpData.impressions,
              clicks: cmpData.clicks,
              ctr: `${cmpData.ctr || 0} %`,
              period: (
                <span>
                  <span>
                    {cmpData.campaign.activeFrom
                      ? periodNumberToDate(cmpData.campaign.activeFrom)
                      : 'N/A'}
                  </span>
                  <br />
                  <span>
                    {cmpData.campaign.activeTo
                      ? periodNumberToDate(cmpData.campaign.activeTo)
                      : 'N/A'}
                  </span>
                </span>
              ),
              cpm: (
                <span>
                  <span>
                    {(
                      parseBigNumTokenAmountToDecimal(
                        cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.min || 0n,
                        decimals
                      ) * 1000
                    ).toFixed(2)}
                  </span>
                  {' - '}{' '}
                  <span>
                    {(
                      parseBigNumTokenAmountToDecimal(
                        cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.max || 0n,
                        decimals
                      ) * 1000
                    ).toFixed(2)}
                  </span>
                  <br />
                  <span>{`(avg: ${cmpData.avgCpm?.toFixed(2) || 0})`}</span>
                </span>
              )
            }
          })
        : [],
    [filteredCampaignData]
  )

  const handlePreview = useCallback(
    (data: DashboardTableElement['actionData']) => {
      navigate(`/dashboard/campaign-details/${isAdminPanel ? 'admin/' : ''}${data.campaign.id}`, {})
    },
    [isAdminPanel, navigate]
  )

  const handleAnalytics = useCallback(
    (data: DashboardTableElement['actionData']) => {
      navigate(`/dashboard/campaign-analytics/${data.campaign.id}`)
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (data: DashboardTableElement['actionData'], isDuplicate?: boolean) => {
      if (isAdminPanel) {
        return
      }

      if (data.campaign) {
        updateCampaignFromDraft({
          ...data.campaign,
          ...(isDuplicate && {
            id: '',
            title: `Copy - ${data.campaign.title}`,
            status: CampaignStatus.created
          })
        })
        navigate('/dashboard/create-campaign', { replace: true })
      } else {
        showNotification('error', 'Editing draft campaign failed', 'Editing draft campaign failed')
      }
    },
    [isAdminPanel, updateCampaignFromDraft, navigate, showNotification]
  )

  const handleDuplicate = useCallback(
    (campaign: DashboardTableElement['actionDta']) => {
      return handleEdit(campaign, true)
    },
    [handleEdit]
  )

  // NOTE: @Maskln - this is how confirm dialog should work - not to handle the state everywhere is used ... it can be customized to match the design https://v6.mantine.dev/others/modals/#context-modals
  const handleDelete = useCallback(
    (data: DashboardTableElement['actionData']) =>
      modals.openConfirmModal({
        title: 'Delete draft',
        children: <Text size="sm">Are you sure want to delete draft {data.campaign.title}</Text>,
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteDraftCampaign(data.campaign.id)
      }),
    [deleteDraftCampaign]
  )

  const handleArchive = useCallback(
    (data: DashboardTableElement['actionData']) => {
      const cmp = data.campaign
      const confirm = cmp?.archived ? 'Unarchive' : 'Archive'

      return modals.openConfirmModal({
        title: `${confirm} Campaign`,
        children: (
          <Text size="sm">
            Are you sure want to {confirm} campaign {cmp?.title}
          </Text>
        ),
        labels: { confirm, cancel: 'Cancel' },
        confirmProps: { color: cmp?.archived ? 'blue' : 'red' },
        onConfirm: () => toggleArchived(cmp?.id || '')
      })
    },
    [toggleArchived]
  )

  const toggleShowArchived = useCallback(() => {
    setShowArchived((prevShowArchived) => !prevShowArchived)
  }, [])

  // NOTE: redirect to get-started page id no campaigns found
  useEffect(() => {
    if (!accountId && !filteredCampaignData.campaignData.length && !initialDataLoading) {
      navigate('/dashboard/get-started', { replace: true })
    }
  }, [accountId, filteredCampaignData, initialDataLoading, navigate])

  useEffect(() => {
    updateAllCampaignsData(true)
  }, [updateAllCampaignsData])

  const actions = useMemo(() => {
    const dashboardActions: TableRowAction[] = [
      {
        action: handlePreview,
        label: 'Show Details',
        icon: <VisibilityIcon />
      },
      {
        action: handleAnalytics,
        label: 'Show Analytics',
        icon: <AnalyticsIcon />,
        disabled: (ada: DashboardTableElement['actionData']) => ada.isDraft
      }
    ]

    if (!isAdminPanel) {
      dashboardActions.push(
        ...[
          {
            action: handleEdit,
            label: 'Edit Draft',
            icon: <EditIcon />,
            disabled: (ada: DashboardTableElement['actionData']) => !ada.isDraft
          },
          {
            action: handleDuplicate,
            label: 'Clone and edit',
            icon: <DuplicateIcon />
          },
          {
            action: handleDelete,
            label: 'Delete Draft',
            icon: <DeleteIcon />,
            disabled: (ada: DashboardTableElement['actionData']) => !ada.isDraft
          },
          {
            action: handleArchive,
            label: 'Archive Campaign',
            icon: <DeleteIcon />,
            disabled: (ada: DashboardTableElement['actionData']) => !ada.canArchive
          }
        ]
      )
    }

    return dashboardActions
  }, [
    handleAnalytics,
    handleArchive,
    handleDelete,
    handleDuplicate,
    handleEdit,
    handlePreview,
    isAdminPanel
  ])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          <Text size="sm" color="secondaryText" weight="bold" mb="md">
            {isAdminPanel ? '* admin' : 'All campaigns'}
          </Text>

          {!!filteredCampaignData.archivedCount && (
            <UnstyledButton onClick={toggleShowArchived}>
              <Text size="sm" underline color="secondaryText">
                {showArchived ? 'Hide Archived' : 'Show Archived'} (
                {filteredCampaignData.archivedCount})
              </Text>
            </UnstyledButton>
          )}
        </Flex>
        {!initialDataLoading ? (
          <CustomTable
            background
            headings={campaignHeaders}
            elements={elements}
            actions={actions}
          />
        ) : (
          <Flex justify="center" align="center" h="60vh">
            <Loader size="xl" />
          </Flex>
        )}
      </Flex>
    </Container>
  )
}

export default Dashboard
