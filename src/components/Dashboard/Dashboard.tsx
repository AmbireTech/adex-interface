import {
  CampaignStatus,
  // CampaignType,
  EventType
} from 'adex-common'
import { Container, Flex, Text, Loader, UnstyledButton } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CustomTable from 'components/common/CustomTable'
import { periodNumberToDate } from 'helpers'
import { useNavigate } from 'react-router-dom'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { modals } from '@mantine/modals'

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

type TableElement = {
  rowColor: string | undefined
  id: string
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

  // Temporary disabled show/hide archived until no functionality implemented
  const [showArchived, setShowArchived] = useState(true)
  const filteredCampaignData = useMemo(() => {
    // if (!showArchived) {
    //   // TODO: change 'CampaignStatus.expired' to 'CampaignStatus.archived' when has been added to the model
    //   return campaignsData && Array.from(campaignsData.values()).length > 0
    //     ? Array.from(campaignsData.values()).filter(
    //         (campaign) => campaign.campaign.status !== CampaignStatus.expired
    //       )
    //     : []
    // }

    return Array.from(campaignsData.values())
      .filter(
        (x) =>
          (accountId ? x.campaign.owner.toLowerCase() === accountId.toLowerCase() : true) &&
          (!x.campaign.archived || showArchived)
      )
      .sort((a, b) => {
        const statusOrderDiff =
          getStatusOrder(a.campaign.status) - getStatusOrder(b.campaign.status)
        if (statusOrderDiff !== 0) {
          return statusOrderDiff
        }
        return Number(b.campaign.created) - Number(a.campaign.created)
      })
  }, [campaignsData, accountId, showArchived])

  const elements: TableElement[] = useMemo(
    () =>
      filteredCampaignData.length
        ? filteredCampaignData.map((cmpData) => {
            const decimals = cmpData.campaign.outpaceAssetDecimals
            const budget = parseBigNumTokenAmountToDecimal(
              cmpData.campaign.campaignBudget,
              decimals
            )

            return {
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
    (item: TableElement) => {
      navigate(`/dashboard/campaign-details/${isAdminPanel ? 'admin/' : ''}${item.id}`, {})
    },
    [isAdminPanel, navigate]
  )

  const handleAnalytics = useCallback(
    (item: TableElement) => {
      navigate(`/dashboard/campaign-analytics/${item.id}`)
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (item: TableElement, isDuplicate?: boolean) => {
      if (isAdminPanel) {
        return
      }
      const selectedCampaign = filteredCampaignData.find(
        (campaign) => campaign.campaignId === item.id
      )?.campaign

      if (selectedCampaign) {
        updateCampaignFromDraft({
          ...selectedCampaign,
          ...(isDuplicate && {
            id: '',
            title: `Copy - ${selectedCampaign.title}`,
            status: CampaignStatus.created
          })
        })
        navigate('/dashboard/create-campaign', { replace: true })
      } else {
        showNotification('error', 'Editing draft campaign failed', 'Editing draft campaign failed')
      }
    },
    [isAdminPanel, filteredCampaignData, updateCampaignFromDraft, navigate, showNotification]
  )

  const handleDuplicate = useCallback(
    (el: TableElement) => {
      return handleEdit(el, true)
    },
    [handleEdit]
  )

  // NOTE: @Maskln - this is how confirm dialog should work - not to handle the state everywhere is used ... it can be customized to match the design https://v6.mantine.dev/others/modals/#context-modals
  const handleDelete = useCallback(
    (el: TableElement) =>
      modals.openConfirmModal({
        title: 'Delete draft',
        children: <Text size="sm">Are you sure want to delete draft {el.title}</Text>,
        labels: { confirm: 'Delete', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: () => deleteDraftCampaign(el.id)
      }),
    [deleteDraftCampaign]
  )

  const handleArchive = useCallback(
    (el: TableElement) => {
      const cmp = campaignsData.get(el.id)?.campaign
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
    [campaignsData, toggleArchived]
  )

  const toggleShowArchived = useCallback(() => {
    setShowArchived((prevShowArchived) => !prevShowArchived)
  }, [])

  // NOTE: redirect to get-started page id no campaigns found
  useEffect(() => {
    if (!accountId && !filteredCampaignData.length && !initialDataLoading) {
      navigate('/dashboard/get-started', { replace: true })
    }
  }, [accountId, filteredCampaignData, initialDataLoading, navigate])

  useEffect(() => {
    updateAllCampaignsData(true)
  }, [updateAllCampaignsData])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          {isAdminPanel ? (
            ''
          ) : (
            <Text size="sm" color="secondaryText" weight="bold" mb="md">
              All Campaigns
            </Text>
          )}
          <UnstyledButton onClick={toggleShowArchived}>
            <Text size="sm" underline color="secondaryText">
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Text>
          </UnstyledButton>
        </Flex>
        {!initialDataLoading ? (
          <CustomTable
            background
            headings={campaignHeaders}
            elements={elements}
            onPreview={handlePreview}
            onAnalytics={handleAnalytics}
            onEdit={!isAdminPanel ? handleEdit : undefined}
            onDuplicate={!isAdminPanel ? handleDuplicate : undefined}
            onDelete={!isAdminPanel ? handleDelete : undefined}
            onArchive={!isAdminPanel ? handleArchive : undefined}
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
