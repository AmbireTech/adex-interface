import React, { useCallback, useEffect, useState } from 'react'
import { Container, Flex, Tabs } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { TabType } from 'types'
import GoBack from 'components/common/GoBack/GoBack'
import DownloadCSV from 'components/common/DownloadCSV'
import Placements from './Placements'
import { dashboardTableElements } from '../Dashboard/mockData'
import Creatives from './Creatives'
import Regions from './Regions'
import TimeFrame from './TimeFrame'
import { generateCVSData } from './CvsDownloadConfigurations'
import SeeOnMapBtn from './SeeOnMapBtn'

const CampaignAnalytics = () => {
  const { id } = useParams()
  if (!id || Number.isNaN(parseInt(id, 10))) {
    return <div>Invalid campaign ID</div>
  }
  // TODO: state management for elements
  const [activeTab, setActiveTab] = useState<TabType | null>('timeframe')
  const [isMapBtnShown, setIsMapBtnShown] = useState<boolean>(false)
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  const campaignDetails = dashboardTableElements.find((item) => item.id === parseInt(id, 10))
  const [csvData, setCsvData] = useState(generateCVSData('placements', campaignDetails?.placements))

  useEffect(() => {
    setIsMapBtnShown(activeTab === 'regions')
    const tabName = activeTab as TabType
    setCsvData(generateCVSData(tabName, campaignDetails?.[tabName]))
  }, [activeTab, campaignDetails])

  const handleTabChange = useCallback((value: TabType) => {
    setActiveTab(value)
  }, [])

  return (
    <Container fluid>
      <GoBack title="Campaign Analytics" />
      <Tabs
        color="brand"
        value={activeTab}
        onTabChange={handleTabChange}
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
          <Flex align="center" justify="space-between">
            {isMapBtnShown && <SeeOnMapBtn onBtnClicked={() => setIsMapVisible((prev) => !prev)} />}
            {activeTab !== 'timeframe' && (
              <DownloadCSV
                data={csvData.tabData}
                mapHeadersToDataProperties={csvData.mapHeadersToDataProperties}
                filename={csvData.filename}
              />
            )}
          </Flex>
        </Flex>
        <Tabs.Panel value="timeframe" pt="xs">
          <TimeFrame timeFrames={campaignDetails?.timeframe} period={campaignDetails?.period} />
        </Tabs.Panel>
        <Tabs.Panel value="placements" pt="xs">
          <Placements placements={campaignDetails?.placements} />
        </Tabs.Panel>
        <Tabs.Panel value="regions" pt="xs">
          <Regions
            regions={campaignDetails?.regions}
            isMapVisible={isMapVisible}
            onClose={() => setIsMapVisible(false)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="creatives" pt="xs">
          <Creatives creatives={campaignDetails?.creatives} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
