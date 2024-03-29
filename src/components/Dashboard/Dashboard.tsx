import { Campaign } from 'adex-common'
import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useMemo } from 'react'
import CustomTable from 'components/common/CustomTable'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
import { useNavigate } from 'react-router-dom'
import useCampaignsData from 'hooks/useCampaignsData'
import BadgeStatusCampaign from './BadgeStatusCampaign'

const Dashboard = () => {
  const navigate = useNavigate()
  const { campaignsData } = useCampaignsData()

  const elements = useMemo(
    () =>
      Array.from(campaignsData.values()).map((cmpData) => {
        return {
          id: cmpData.campaignId,
          title: cmpData.campaign.title,
          model: cmpData.campaign.type,
          status: <BadgeStatusCampaign type={cmpData.campaign.status} />,
          served: 'No data',
          budget: 'No data',
          impressions: 'No data',
          clicks: 'No data',
          ctr: 'No data',
          period: campaignPeriodParser([cmpData.campaign.activeFrom, cmpData.campaign.activeTo])
        }
      }),
    [campaignsData]
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
    console.log('item', item)
  }, [])

  const handleDelete = useCallback((item: Campaign) => {
    console.log('item', item)
  }, [])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Text size="sm" color="secondaryText" weight="bold" mb="md">
          All Campaigns
        </Text>
        {/* {!isResolved && 'Loading'} */}

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
