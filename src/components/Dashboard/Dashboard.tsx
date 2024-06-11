import {
  Campaign,
  // CampaignType,
  EventType
} from 'adex-common'
import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
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

const Dashboard = ({ isAdminPanel }: { isAdminPanel?: boolean }) => {
  const navigate = useNavigate()
  const { campaignsData } = useCampaignsData()
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
    return Array.from(campaignsData.values()).reverse()
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
                cmpData.paid && budget
                  ? `${((cmpData.paid / budget) * 100).toFixed(2)} %`
                  : '0.00 %',
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

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          {isAdminPanel ? (
            'WSWDD'
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
      </Flex>
      <AdminCampaignModal item={selectedItem?.campaign || null} opened={opened} close={close} />
    </Container>
  )
}

export default Dashboard
