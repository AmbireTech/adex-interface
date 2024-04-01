import { Campaign, CampaignStatus } from 'adex-common'
import { Container, Flex, Text, UnstyledButton } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import CustomTable from 'components/common/CustomTable'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
import { useNavigate } from 'react-router-dom'
import useAccount from 'hooks/useAccount'
import useCampaignsData from 'hooks/useCampaignsData'
import BadgeStatusCampaign from './BadgeStatusCampaign'

const Dashboard = () => {
  const navigate = useNavigate()
  const { getAllCampaigns } = useCampaignsData()
  const { adexAccount } = useAccount()
  const [campaignData, setCampaingData] = useState<Campaign[]>([])
  const [error, setError] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  useEffect(() => {
    getAllCampaigns()
      .then((res) => {
        if (res) {
          setCampaingData(res)
        }
      })
      .catch((e) => {
        console.error('Error getting data:', e)
        setError(true)
      })
  }, [getAllCampaigns, adexAccount?.accessToken])

  const filteredCampaignData = useMemo(() => {
    if (!showArchived) {
      // TODO: change 'CampaignStatus.expired' to 'CampaignStatus.archived' when has been added to the model
      return campaignData && !error
        ? campaignData.filter((campaign) => campaign.status !== CampaignStatus.expired)
        : []
    }
    return campaignData
  }, [campaignData, showArchived, error])

  const elements = useMemo(
    () =>
      filteredCampaignData.length
        ? filteredCampaignData.map((el: Campaign) => ({
            id: el.id,
            title: el.title,
            model: el.type,
            status: <BadgeStatusCampaign type={el.status} />,
            served: 'No data',
            budget: 'No data',
            impressions: 'No data',
            clicks: 'No data',
            ctr: 'No data',
            period: campaignPeriodParser([el.activeFrom, el.activeTo])
          }))
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
            <Flex align="center">
              <Text size="sm" underline color="secondaryText">
                {showArchived ? 'Hide Archived' : 'Show Archived'}
              </Text>
            </Flex>
          </UnstyledButton>
        </Flex>
        {error ? (
          'Error getting data'
        ) : (
          <CustomTable
            background
            headings={campaignHeaders}
            elements={elements}
            onPreview={handlePreview}
            onAnalytics={handleAnalytics}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        )}
      </Flex>
    </Container>
  )
}

export default Dashboard
