import {
  // Campaign,
  CampaignStatus,
  // CampaignType,
  EventType
} from 'adex-common'
import { Container, Flex, Text, UnstyledButton, Anchor, Stack, Group } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CustomTable, {
  DataElement,
  TableRowAction
  // TableElement
} from 'components/common/CustomTable'
import { Link, useNavigate } from 'react-router-dom'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { parseBigNumTokenAmountToDecimal, maskAddress, periodNumberToDate } from 'helpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { modals } from '@mantine/modals'
import VisibilityIcon from 'resources/icons/Visibility'
import AnalyticsIcon from 'resources/icons/Analytics'
import DuplicateIcon from 'resources/icons/Duplicate'
import DeleteIcon from 'resources/icons/Delete'
import EditIcon from 'resources/icons/Edit'
import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
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

// type DashboardTableElement = Omit<TableElement, 'actionData'> & {
//   actionData: { campaign: Campaign; isDraft: boolean; canArchive: boolean }
//   title: string | JSX.Element
//   placement: string
//   status: {
//     value: CampaignStatus
//     element: JSX.Element
//   }
//   served: string
//   budget: string
//   impressions: number
//   clicks: number
//   ctr: string
//   period: JSX.Element
//   cpm: JSX.Element
// }

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
  const [showArchived, setShowArchived] = useState(false)
  const filteredCampaignData = useMemo(() => {
    let archivedCount = 0
    const campaignData = Array.from(campaignsData.values())
      .filter((x) => {
        const matchFilter =
          isAdminPanel && accountId
            ? x.campaign.owner.toLowerCase() === accountId.toLowerCase()
            : true

        const isArchived = matchFilter && x.campaign.archived
        if (isArchived) archivedCount++

        return matchFilter && ((!showArchived && !isArchived) || (showArchived && isArchived))
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

  const elements: DataElement[] = useMemo(
    () =>
      filteredCampaignData.campaignData.length
        ? filteredCampaignData.campaignData.map((cmpData) => {
            const campaign = cmpData.campaign
            const decimals = cmpData.campaign.outpaceAssetDecimals
            const budget = parseBigNumTokenAmountToDecimal(
              cmpData.campaign.campaignBudget,
              decimals
            )

            const archived = cmpData.campaign.archived

            const served = cmpData.paid && budget ? Math.round((cmpData.paid / budget) * 100) : 0

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
              rowColor: archived ? 'warning' : undefined,
              id: cmpData.campaignId,
              columns: [
                {
                  value: cmpData.campaign.title,
                  element: (
                    <Stack gap="xs">
                      <Group wrap="nowrap">
                        {archived && (
                          <BadgeStatusCampaign
                            type={cmpData.campaign.status}
                            isArchived={archived}
                          />
                        )}
                        <Text size="sm" truncate maw={200}>
                          {cmpData.campaign.title}
                        </Text>
                      </Group>

                      {isAdminPanel && (
                        <Anchor
                          component={Link}
                          inline
                          underline="never"
                          size="xs"
                          to={`/dashboard/admin/user-account/${campaign.owner}`}
                          c="secondaryText"
                        >
                          {maskAddress(campaign.owner)}
                        </Anchor>
                      )}
                    </Stack>
                  )
                },
                // type: CampaignType[cmpData.campaign.type],
                {
                  value:
                    cmpData.campaign.targetingInput.inputs.placements.in[0] === 'app'
                      ? 'App'
                      : 'Website'
                },
                {
                  value: getStatusOrder(cmpData.campaign.status),
                  element: <BadgeStatusCampaign type={cmpData.campaign.status} />
                },
                {
                  value: served,
                  element: `${served} %`
                },
                // TODO: get token name
                { value: budget, element: `${budget} USDC` },
                { value: cmpData.impressions },
                { value: cmpData.clicks },
                { value: Number(cmpData.ctr), element: `${cmpData.ctr || 0} %` },
                {
                  value: cmpData.campaign.created,
                  element: (
                    <Stack gap="xs">
                      <Text size="sm" inline>
                        {cmpData.campaign.activeFrom
                          ? periodNumberToDate(cmpData.campaign.activeFrom)
                          : 'N/A'}
                      </Text>

                      <Text size="sm" inline>
                        {cmpData.campaign.activeTo
                          ? periodNumberToDate(cmpData.campaign.activeTo)
                          : 'N/A'}
                      </Text>
                    </Stack>
                  )
                },
                {
                  value: cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.min,
                  element: (
                    <Stack gap="xs">
                      <Text size="sm" inline styles={{ root: { whiteSpace: 'nowrap' } }}>
                        {`${(
                          parseBigNumTokenAmountToDecimal(
                            cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.min || 0n,
                            decimals
                          ) * 1000
                        ).toFixed(2)} - ${(
                          parseBigNumTokenAmountToDecimal(
                            cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.max || 0n,
                            decimals
                          ) * 1000
                        ).toFixed(2)}`}
                      </Text>
                      <Text size="sm" inline>{`(avg: ${cmpData.avgCpm?.toFixed(2) || 0})`}</Text>
                    </Stack>
                  )
                }
              ]
            }
          })
        : [],
    [filteredCampaignData.campaignData, isAdminPanel]
  )

  const handlePreview = useCallback(
    (data: DataElement['actionData']) => {
      navigate(`/dashboard/campaign-details/${isAdminPanel ? 'admin/' : ''}${data.campaign.id}`, {})
    },
    [isAdminPanel, navigate]
  )

  const handleAnalytics = useCallback(
    (data: DataElement['actionData']) => {
      navigate(`/dashboard/campaign-analytics/${isAdminPanel ? 'admin/' : ''}${data.campaign.id}`)
    },
    [isAdminPanel, navigate]
  )

  const handleEditDraft = useCallback(
    (data: DataElement['actionData'], isDuplicate?: boolean) => {
      if (isAdminPanel) {
        return
      }

      data.campaign && updateCampaignFromDraft({ ...data.campaign }, isDuplicate)
      navigate('/dashboard/create-campaign', {})
    },
    [isAdminPanel, updateCampaignFromDraft, navigate]
  )

  const handleEdit = useCallback(
    (data: DataElement['actionData']) =>
      navigate(`/dashboard/campaign-details/${data.campaign.id}/budget?edit=true`, {}),
    [navigate]
  )

  const handleDuplicate = useCallback(
    (campaign: DataElement['actionData']) => {
      return handleEditDraft(campaign, true)
    },
    [handleEditDraft]
  )

  const handleDelete = useCallback(
    (data: DataElement['actionData']) =>
      modals.openConfirmModal(
        defaultConfirmModalProps({
          text: `Are you sure want to delete draft "${data.campaign.title}"`,
          color: 'warning',
          labels: { confirm: 'Delete', cancel: 'Cancel' },
          onConfirm: () => deleteDraftCampaign(data.campaign.id)
        })
      ),
    [deleteDraftCampaign]
  )

  const handleArchive = useCallback(
    (data: DataElement['actionData']) => {
      const cmp = data.campaign
      const confirm = cmp?.archived ? 'Unarchive' : 'Archive'

      modals.openConfirmModal(
        defaultConfirmModalProps({
          text: `Are you sure want to ${confirm} campaign "${cmp?.title}"`,
          color: cmp?.archived ? 'brand' : 'attention',
          labels: { confirm, cancel: 'Cancel' },
          onConfirm: () => toggleArchived(cmp?.id || '')
        })
      )
    },
    [toggleArchived]
  )

  const toggleShowArchived = useCallback(() => {
    setShowArchived((prevShowArchived) => !prevShowArchived)
  }, [])

  // NOTE: redirect to get-started page id no campaigns found
  useEffect(() => {
    if (
      !accountId &&
      !filteredCampaignData.campaignData.length &&
      !initialDataLoading &&
      !isAdminPanel
    ) {
      navigate('/dashboard/get-started', { replace: true })
    }
  }, [accountId, filteredCampaignData, initialDataLoading, isAdminPanel, navigate])

  useEffect(() => {
    updateAllCampaignsData(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        disabled: (ada: DataElement['actionData']) =>
          ada.isDraft ||
          [
            CampaignStatus.rejected,
            CampaignStatus.ready,
            CampaignStatus.inReview,
            CampaignStatus.created
          ].includes(ada.campaign.status)
      }
    ]

    if (!isAdminPanel) {
      dashboardActions.push(
        ...[
          {
            action: handleEditDraft,
            label: 'Continue Edit',
            icon: <EditIcon />,
            hide: (ada: DataElement['actionData']) => !ada.isDraft
          },
          {
            action: handleEdit,
            disabled: (ada: DataElement['actionData']) =>
              ![CampaignStatus.active, CampaignStatus.paused].includes(ada.campaign.status),
            label: 'Edit',
            icon: <EditIcon />,
            hide: (ada: DataElement['actionData']) => ada.isDraft
          },
          {
            action: handleDuplicate,
            label: 'Clone and create new',
            icon: <DuplicateIcon />
          },
          {
            action: handleArchive,
            label: (ada: DataElement['actionData']) =>
              `${ada.campaign.archived ? 'Unarchive' : 'Archive'}  Campaign`,
            icon: <DeleteIcon />,
            hide: (ada: DataElement['actionData']) => !ada.canArchive
          },
          {
            action: handleDelete,
            label: 'Delete Draft',
            icon: <DeleteIcon />,
            color: 'red',
            hide: (ada: DataElement['actionData']) => !ada.isDraft
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
    handleEditDraft,
    handlePreview,
    isAdminPanel
  ])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          <Text size="sm" c="secondaryText" fw="bold" mb="md">
            {isAdminPanel ? '* admin' : 'All campaigns'}
          </Text>

          {!!filteredCampaignData.archivedCount && (
            <UnstyledButton onClick={toggleShowArchived}>
              <Text size="sm" td="underline" c="secondaryText">
                {showArchived ? 'Hide Archived' : 'Show Archived'} (
                {filteredCampaignData.archivedCount})
              </Text>
            </UnstyledButton>
          )}
        </Flex>
        <CustomTable
          shadow={!isAdminPanel ? 'xs' : undefined}
          defaultSortIndex={2}
          defaultSortDirection={1}
          headings={campaignHeaders}
          data={elements}
          actions={actions}
          loading={initialDataLoading}
        />
      </Flex>
    </Container>
  )
}

export default Dashboard
