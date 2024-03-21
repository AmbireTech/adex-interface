import { Campaign } from 'adex-common'
import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useMemo } from 'react'
// import { useDisclosure } from '@mantine/hooks'
import { useApi } from 'lib/api'
import CustomTable from 'components/common/CustomTable'
import { BadgeType } from 'types'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
// import { CampaignDetailsModal } from 'components/common/Modals'
import { useNavigate } from 'react-router-dom'
import BadgeStatusCampaign from './BadgeStatusCampaign'

const Dashboard = () => {
  // const [opened, { open, close }] = useDisclosure(false)
  // const [selectedItem, setSelectedItem] = useState<ICampaignData | null>(null)
  const navigate = useNavigate()
  const [campaignData, isResolved, error] = useApi<Campaign[]>({
    // we can also make an independent file handling all the endpoints and calling a function
    // ex. const [selectedItem, setSelectedItem] = getCampaignsByOwner() and hold all the requests there
    // in case of endpoint change we can modify only in one place and affect all dependent files
    endpoint: '/dsp/campaigns/by-owner'
  })
  const elements = useMemo(
    () =>
      campaignData && !error
        ? campaignData?.map((el: Campaign) => {
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
    [campaignData, error]
  )

  const handlePreview = useCallback(
    (item: ICampaignData) => {
      navigate(`/dashboard/campaign-details/${item.id}`)
      // setSelectedItem(item)
      // open()
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
      {/* <CampaignDetailsModal item={selectedItem} opened={opened} close={close} /> */}
    </Container>
  )
}

export default Dashboard
