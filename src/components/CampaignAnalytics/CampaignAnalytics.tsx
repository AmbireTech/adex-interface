import { Container, Flex, Tabs, Text } from '@mantine/core'
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import { useNavigate, useParams } from 'react-router-dom'
import DownloadIcon from 'resources/icons/Download'
import LeftChevronIcon from 'resources/icons/LeftChevron'
import Placements from './Placements'
import { dashboardTableElements } from '../Dashboard/mockData'
import Creatives from './Creatives'
import Regions from './Regions'

const GoBack = ({ title }: { title: string }) => {
  const navigate = useNavigate()
  const handleClick = () => navigate(-1)

  return (
    <ActionButton action={handleClick} icon={<LeftChevronIcon />} title="Campaign Analytics">
      <Text size="sm">{title}</Text>
    </ActionButton>
  )
}

const CampaignAnalytics = () => {
  const { id } = useParams()

  if (!id || Number.isNaN(parseInt(id, 10))) {
    return <div>Invalid campaign ID</div>
  }

  const campaignDetails = dashboardTableElements.find((item) => item.id === parseInt(id, 10))

  return (
    <Container fluid>
      <GoBack title="Campaign Analytics" />
      <Tabs
        color="brand"
        defaultValue="placements"
        styles={() => ({
          tabsList: { border: 'none', padding: '20px' }
        })}
      >
        <Flex justify="space-between" align="baseline">
          <Tabs.List>
            <Tabs.Tab value="timeframe">TIME FRAME</Tabs.Tab>
            <Tabs.Tab value="placements">PLACEMENTS</Tabs.Tab>
            <Tabs.Tab value="regions">REGIONS</Tabs.Tab>
            <Tabs.Tab value="creatives">CREATIVES</Tabs.Tab>
          </Tabs.List>
          <Flex align="center">
            <Text size="sm" mr="sm">
              Download CSV
            </Text>
            <DownloadIcon size="24px" />
          </Flex>
        </Flex>
        <Tabs.Panel value="timeframe" pt="xs">
          TIME FRAME
        </Tabs.Panel>
        <Tabs.Panel value="placements" pt="xs">
          <Placements placements={campaignDetails?.placements} />
        </Tabs.Panel>
        <Tabs.Panel value="regions" pt="xs">
          <Regions regions={campaignDetails?.regions} />
        </Tabs.Panel>
        <Tabs.Panel value="creatives" pt="xs">
          <Creatives creatives={campaignDetails?.creatives} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
