import { Campaign, CampaignStatus, CampaignType } from 'adex-common'
import { Container, Flex, Text, UnstyledButton } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import CustomTable from 'components/common/CustomTable'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
import { useNavigate } from 'react-router-dom'
import useCampaignsData from 'hooks/useCampaignsData'
import BadgeStatusCampaign from './BadgeStatusCampaign'

const Dashboard = () => {
  const navigate = useNavigate()
  const { campaignsData } = useCampaignsData()
  const [showArchived, setShowArchived] = useState(false)
  const filteredCampaignData = useMemo(() => {
    if (!showArchived) {
      // TODO: change 'CampaignStatus.expired' to 'CampaignStatus.archived' when has been added to the model
      return campaignsData && Array.from(campaignsData.values()).length > 0
        ? Array.from(campaignsData.values()).filter(
            (campaign) => campaign.campaign.status !== CampaignStatus.expired
          )
        : []
    }
    return Array.from(campaignsData.values())
  }, [campaignsData, showArchived])

  const elements = useMemo(
    () =>
      filteredCampaignData.length
        ? filteredCampaignData.map((cmpData) => {
            return {
              id: cmpData.campaignId,
              title: cmpData.campaign.title,
              model: CampaignType[cmpData.campaign.type],
              status: <BadgeStatusCampaign type={cmpData.campaign.status} />,
              served: 'No data',
              budget: 'No data',
              impressions: 'No data',
              clicks: 'No data',
              ctr: 'No data',
              period: campaignPeriodParser([cmpData.campaign.activeFrom, cmpData.campaign.activeTo])
            }
          })
        : [],
    [filteredCampaignData]
  )

  const handlePreview = useCallback(
    (item: Campaign) => {
      navigate(`/dashboard/campaign-details/${item.id}`)
    },
    [navigate]
  )

  const handleAnalytics = useCallback(
    (item: Campaign) => {
      navigate(`/dashboard/campaign-analytics/${item.id}`)
    },
    [navigate]
  )

  const handleDuplicate = useCallback((item: Campaign) => {
    // TODO: Implement duplication logic
    console.log('item', item)
  }, [])

  const handleDelete = useCallback((item: Campaign) => {
    // TODO: Implement deletion logic
    console.log('item', item)
  }, [])

  const toggleShowArchived = useCallback(() => {
    setShowArchived((prevShowArchived) => !prevShowArchived)
  }, [])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          <Text size="sm" color="secondaryText" weight="bold" mb="md">
            All Campaigns
          </Text>
          <UnstyledButton onClick={toggleShowArchived}>
            <Text size="sm" underline color="secondaryText">
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Text>
          </UnstyledButton>
        </Flex>
        <CustomTable
          background
          headings={campaignHeaders}
          elements={elements}
          onPreview={handlePreview}
          onAnalytics={handleAnalytics}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </Flex>
    </Container>
  )
}

export default Dashboard
