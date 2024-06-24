import {
  Campaign,
  CampaignStatus,
  // CampaignType,
  EventType
} from 'adex-common'
import { Container, Flex, Text, Badge, Loader } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import CustomTable from 'components/common/CustomTable'
import { periodNumberToDate } from 'helpers'
import { useNavigate } from 'react-router-dom'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { AdminCampaignModal } from 'components/common/Modals'
import { CampaignData } from 'types'
import UnderReviewIcon from 'resources/icons/UnderReview'
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
  active: 2,
  paused: 3,
  stopped: 4,
  completed: 5
}

const getStatusOrder = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.inReview:
      return statusOrder.inReview
    case CampaignStatus.draft:
      return statusOrder.draft
    case CampaignStatus.active:
      return statusOrder.active
    case CampaignStatus.paused:
      return statusOrder.paused
    case CampaignStatus.closedByUser:
    case CampaignStatus.expired:
    case CampaignStatus.exhausted:
      return statusOrder.stopped
    default:
      return statusOrder.completed
  }
}

const Dashboard = ({ isAdminPanel }: { isAdminPanel?: boolean }) => {
  const navigate = useNavigate()
  const { campaignsData, initialDataLoading } = useCampaignsData()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedItem, setSelectedItem] = useState<CampaignData | null>(null)
  const { updateCampaignFromDraft } = useCreateCampaignContext()
  const { showNotification } = useCustomNotifications()
  // Temporary disabled show/hide archived until no functionality implemented
  // const [showArchived, setShowArchived] = useState(false)
  const filteredCampaignData = useMemo(() => {
    // if (!showArchived) {
    //   // TODO: change 'CampaignStatus.expired' to 'CampaignStatus.archived' when has been added to the model
    //   return campaignsData && Array.from(campaignsData.values()).length > 0
    //     ? Array.from(campaignsData.values()).filter(
    //         (campaign) => campaign.campaign.status !== CampaignStatus.expired
    //       )
    //     : []
    // }
    return Array.from(campaignsData.values()).sort((a, b) => {
      const statusOrderDiff = getStatusOrder(a.campaign.status) - getStatusOrder(b.campaign.status)
      if (statusOrderDiff !== 0) {
        return statusOrderDiff
      }
      return Number(b.campaign.created) - Number(a.campaign.created)
    })
  }, [campaignsData])

  const elements = useMemo(
    () =>
      filteredCampaignData.length
        ? filteredCampaignData.map((cmpData) => {
            const decimals = cmpData.campaign.outpaceAssetDecimals
            const budget = parseBigNumTokenAmountToDecimal(
              cmpData.campaign.campaignBudget,
              decimals
            )

            return {
              id: cmpData.campaignId,
              title: cmpData.campaign.title,
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
    (item: Campaign) => {
      if (isAdminPanel) {
        setSelectedItem(campaignsData?.get(item.id) || null)
        open()
      } else {
        navigate(`/dashboard/campaign-details/${item.id}`)
      }
    },
    [campaignsData, isAdminPanel, navigate, open]
  )

  const handleAnalytics = useCallback(
    (item: Campaign) => {
      navigate(`/dashboard/campaign-analytics/${item.id}`)
    },
    [navigate]
  )

  const handleEdit = useCallback(
    (item: Campaign) => {
      const selectedCampaign = filteredCampaignData.find(
        (campaign) => campaign.campaignId === item.id
      )?.campaign

      if (selectedCampaign) {
        updateCampaignFromDraft(selectedCampaign)
        navigate('/dashboard/create-campaign')
      } else {
        showNotification('error', 'Editing draft campaign failed', 'Editing draft campaign failed')
      }
    },
    [filteredCampaignData, updateCampaignFromDraft, navigate, showNotification]
  )

  // const handleDuplicate = useCallback((item: Campaign) => {
  //   // TODO: Implement duplication logic
  //   console.log('item', item)
  // }, [])

  // const handleDelete = useCallback((item: Campaign) => {
  //   // TODO: Implement deletion logic
  //   console.log('item', item)
  // }, [])

  // const toggleShowArchived = useCallback(() => {
  //   setShowArchived((prevShowArchived) => !prevShowArchived)
  // }, [])

  // useEffect(() => {
  //   if (filteredCampaignData.length === 0) {
  //     navigate('/dashboard/get-started', { replace: true })
  //   }
  // }, [navigate, filteredCampaignData.length])

  // NOTE: redirect to get-started page id no campaigns found
  useEffect(() => {
    if (!filteredCampaignData.length && !initialDataLoading) {
      navigate('/dashboard/get-started', { replace: true })
    }
  }, [filteredCampaignData, initialDataLoading, navigate])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          {isAdminPanel ? (
            <Badge
              variant="gradient"
              gradient={{ from: 'violet', to: 'purple' }}
              size="xl"
              mb="md"
              fullWidth
              leftSection={<UnderReviewIcon size="13px" />}
              rightSection={<UnderReviewIcon size="13px" />}
            >
              Admin Panel
            </Badge>
          ) : (
            <Text size="sm" color="secondaryText" weight="bold" mb="md">
              All Campaigns
            </Text>
          )}
          {/* Temporary disabled show/hide archived until no functionality implemented */}
          {/* <UnstyledButton onClick={toggleShowArchived}>
            <Text size="sm" underline color="secondaryText">
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Text>
          </UnstyledButton> */}
        </Flex>
        {!initialDataLoading ? (
          <CustomTable
            background
            headings={campaignHeaders}
            elements={elements}
            onPreview={handlePreview}
            onAnalytics={handleAnalytics}
            onEdit={handleEdit}
            // Temporary disabled until no functionality implemented
            // onDuplicate={handleDuplicate}
            // onDelete={handleDelete}
          />
        ) : (
          <Flex justify="center" align="center" h="60vh">
            <Loader size="xl" />
          </Flex>
        )}
      </Flex>
      <AdminCampaignModal item={selectedItem?.campaign || null} opened={opened} close={close} />
    </Container>
  )
}

export default Dashboard
