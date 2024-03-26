import { Campaign } from 'adex-common'
import { Container, Flex, Text } from '@mantine/core'
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

  useEffect(() => {
    getAllCampaigns()
      .then((res) => {
        if (res) {
          setCampaingData(res)
        }
      })
      .catch((e) => {
        console.error('Error getting data:', e)
        setError((prev) => !prev)
        // showDangerNotification(e.message, 'Error getting data')
      })
  }, [getAllCampaigns, adexAccount?.accessToken])

  const elements = useMemo(
    () =>
      campaignData && !error
        ? campaignData?.map((el: Campaign) => {
            return {
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
            }
          })
        : [],
    [campaignData, error]
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
