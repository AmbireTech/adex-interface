import { useCallback, useEffect, useState, useMemo } from 'react'
import { Container, Flex, Tabs } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { AnalyticsType, TabType, ICampaignData } from 'types'
import GoBack from 'components/common/GoBack/GoBack'
import DownloadCSV from 'components/common/DownloadCSV'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import useCampaignsData from 'hooks/useCampaignsData'
import Placements from './Placements'
// import { dashboardTableElements } from '../Dashboard/mockData'
import Creatives from './Creatives'
import Regions from './Regions'
import TimeFrame from './TimeFrame'
import { generateCVSData } from './CvsDownloadConfigurations'
import SeeOnMapBtn from './SeeOnMapBtn'

// TODO: temp - unify and use anal
const analyticTypeToHeader = (aType: AnalyticsType): TabType => {
  switch (aType) {
    case 'country':
      return 'regions'
    case 'hostname':
      return 'placements'
    case 'adUnit':
      return 'creatives'
    default:
      return 'timeframe'
  }
}

const CampaignAnalytics = () => {
  const { id } = useParams()
  if (!id) {
    return <div>Invalid campaign ID</div>
  }
  // TODO: state management for elements
  const [activeTab, setActiveTab] = useState<AnalyticsType>('timeframe')
  const [isMapBtnShown, setIsMapBtnShown] = useState<boolean>(false)
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  // const campaignDetails = dashboardTableElements.find((item) => item.id === parseInt(id, 10))
  const [csvData, setCsvData] = useState<any | undefined>()
  const [analyticsKey, setAnalyticsKey] = useState('')

  const { analyticsData, getAnalyticsKeyAndUpdate, mappedAnalytics } = useCampaignAnalytics()
  const { campaignsData, updateCampaignDataById } = useCampaignsData()

  const campaign = useMemo(() => campaignsData.get(id)?.campaign, [id, campaignsData])

  const campaignAnalytics = useMemo(
    () => analyticsData.get(analyticsKey),
    [analyticsData, analyticsKey]
  )

  const campaignMappedAnalytics: ICampaignData | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey) as ICampaignData,
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    console.log({ campaignAnalytics })
    console.log({ campaignMappedAnalytics })
  }, [campaignAnalytics, campaignMappedAnalytics])

  useEffect(() => {
    if (id) {
      console.log({ id })
      updateCampaignDataById(id)
    }
  }, [id, updateCampaignDataById])

  useEffect(() => {
    if (!campaign) return

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate(campaign, 'country')
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [campaign, getAnalyticsKeyAndUpdate])

  useEffect(() => {
    if (campaignMappedAnalytics) {
      setIsMapBtnShown(activeTab === 'country')

      // TODO: fix csf Data types an add the type to useState
      setCsvData(
        generateCVSData(
          analyticTypeToHeader(activeTab),
          campaignMappedAnalytics[analyticTypeToHeader(activeTab)]
        )
      )
    }
  }, [activeTab, campaignMappedAnalytics])

  const handleTabChange = useCallback((value: AnalyticsType) => {
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
            <Tabs.Tab value="hostname">PLACEMENTS</Tabs.Tab>
            <Tabs.Tab value="countries">REGIONS</Tabs.Tab>
            <Tabs.Tab value="adUnits">CREATIVES</Tabs.Tab>
          </Tabs.List>
          <Flex align="center" justify="space-between">
            {isMapBtnShown && <SeeOnMapBtn onBtnClicked={() => setIsMapVisible((prev) => !prev)} />}
            {csvData && activeTab !== 'timeframe' && (
              <DownloadCSV
                data={csvData.tabData}
                mapHeadersToDataProperties={csvData.mapHeadersToDataProperties}
                filename={csvData.filename}
              />
            )}
          </Flex>
        </Flex>
        <Tabs.Panel value="timeframe" pt="xs">
          <TimeFrame
            timeFrames={campaignMappedAnalytics?.timeframe}
            period={campaignMappedAnalytics?.period}
          />
        </Tabs.Panel>
        <Tabs.Panel value="hostname" pt="xs">
          <Placements placements={campaignMappedAnalytics?.placements} />
        </Tabs.Panel>
        <Tabs.Panel value="countries" pt="xs">
          <Regions
            regions={campaignMappedAnalytics?.regions}
            isMapVisible={isMapVisible}
            onClose={() => setIsMapVisible(false)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="adUnits" pt="xs">
          <Creatives creatives={campaignMappedAnalytics?.creatives} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
