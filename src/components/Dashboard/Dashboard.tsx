import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { useApi } from 'lib/api'
import CustomTable from 'components/common/CustomTable'
import { BadgeType, ICampaign } from 'types'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
import { CampaignDetailsModal } from 'components/common/Modals'
import { useNavigate } from 'react-router-dom'
import BadgeStatusCampaign from './BadgeStatusCampaign'

const Dashboard = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedItem, setSelectedItem] = useState<ICampaign | null>(null)
  const navigate = useNavigate()
  const [campaignData, isResolved, error] = useApi<ICampaign[]>({
    // we can also make an independent file handling all the endpoints and calling a function
    // ex. const [selectedItem, setSelectedItem] = getCampaignsByOwner() and hold all the requests there
    // in case of endpoint change we can modify only in one place and affect all dependent files
    endpoint: '/dsp/campaigns/by-owner'
  })

  const elements = useMemo(
    () =>
      campaignData
        ? campaignData?.map((el: ICampaign) => {
            return {
              id: el.id,
              title: el.title,
              model: el.type,
              status: <BadgeStatusCampaign type={el.status as BadgeType} />,
              served: 'No data',
              budget: 'No data',
              impressions: 'No data',
              clicks: 'No data',
              ctr: 'No data',
              period: campaignPeriodParser([el.activeFrom, el.activeTo])
            }
          })
        : [],
    [campaignData]
  )

  const handlePreview = useCallback(
    (item: ICampaign) => {
      setSelectedItem(item)
      open()
    },
    [open]
  )

  const handleAnalytics = useCallback(
    (item: ICampaign) => {
      navigate(`/campaign-analytics/${item.id}`)
    },
    [navigate]
  )

  const handleDuplicate = useCallback((item: ICampaign) => {
    console.log('item', item)
  }, [])

  const handleDelete = useCallback((item: ICampaign) => {
    console.log('item', item)
  }, [])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Text size="sm" color="secondaryText" weight="bold" mb="md">
          All Campaigns
        </Text>
        {!isResolved && 'Loading'}
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
      <CampaignDetailsModal item={selectedItem} opened={opened} close={close} />
    </Container>
  )
}

export default Dashboard
