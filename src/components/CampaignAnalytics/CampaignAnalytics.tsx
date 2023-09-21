import { useEffect, useState } from 'react'
import { Button, Container, Flex, Tabs, Text } from '@mantine/core'
import ActionButton from 'components/common/CustomTable/ActionButton/ActionButton'
import { useNavigate, useParams } from 'react-router-dom'
import DownloadIcon from 'resources/icons/Download'
import LeftChevronIcon from 'resources/icons/LeftChevron'
import Placements from './Placements'
import { dashboardTableElements } from '../Dashboard/mockData'
import Creatives from './Creatives'
import Regions from './Regions'
import TimeFrame from './TimeFrame'
import { timeFrameData } from './mockData'

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
  const [activeTab, setActiveTab] = useState<string | null>('placements')
  const [isMapBtnShown, setIsMapBtnShown] = useState<boolean>(false)
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)

  useEffect(
    () => (activeTab === 'regions' ? setIsMapBtnShown(true) : setIsMapBtnShown(false)),
    [activeTab]
  )

  if (!id || Number.isNaN(parseInt(id, 10))) {
    return <div>Invalid campaign ID</div>
  }

  const campaignDetails = dashboardTableElements.find((item) => item.id === parseInt(id, 10))

  return (
    <Container fluid>
      <GoBack title="Campaign Analytics" />
      <Tabs
        color="brand"
        value={activeTab}
        onTabChange={setActiveTab}
        styles={() => ({
          tabsList: { border: 'none', padding: '20px 0' }
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
            {isMapBtnShown && (
              <Button mr="md" onClick={() => setIsMapVisible((prev) => !prev)}>
                {isMapVisible ? 'Hide World Map' : 'Show World Map'}
              </Button>
            )}
            <Text size="sm" mr="sm">
              Download CSV
            </Text>
            <DownloadIcon size="24px" />
          </Flex>
        </Flex>
        <Tabs.Panel value="timeframe" pt="xs">
          <TimeFrame timeFrames={timeFrameData} />
        </Tabs.Panel>
        <Tabs.Panel value="placements" pt="xs">
          <Placements placements={campaignDetails?.placements} />
        </Tabs.Panel>
        <Tabs.Panel value="regions" pt="xs">
          <Regions regions={campaignDetails?.regions} isMapVisible={isMapVisible} />
        </Tabs.Panel>
        <Tabs.Panel value="creatives" pt="xs">
          <Creatives creatives={campaignDetails?.creatives} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
