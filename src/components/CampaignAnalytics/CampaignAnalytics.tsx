import { useCallback, useEffect, useState, useMemo } from 'react'
import { Container, Flex, Tabs } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { AnalyticsType, TabType, BaseAnalyticsData, AnalyticsPeriod } from 'types'
import GoBack from 'components/common/GoBack/GoBack'
import DownloadCSV from 'components/common/DownloadCSV'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import useCampaignsData from 'hooks/useCampaignsData'
import { Campaign } from 'adex-common'
import Placements from './Placements'
import Creatives from './Creatives'
import Regions from './Regions'
import { TimeFrame } from './TimeFrame'
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

  const [activeTab, setActiveTab] = useState<AnalyticsType>('timeframe')
  const [isMapBtnShown, setIsMapBtnShown] = useState<boolean>(false)
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  const [csvData, setCsvData] = useState<any | undefined>()
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
        period: AnalyticsPeriod
      }
    | undefined
  >()

  const { analyticsData, getAnalyticsKeyAndUpdate, mappedAnalytics } = useCampaignAnalytics()
  const { campaignsData, updateCampaignDataById } = useCampaignsData()

  const campaign: Campaign | undefined = useMemo(
    () => (id ? campaignsData.get(id)?.campaign : undefined),
    [id, campaignsData]
  )

  const campaignAnalytics = useMemo(
    () => analyticsData.get(analyticsKey?.key || ''),
    [analyticsData, analyticsKey]
  )

  const campaignMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || ''),
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
      const key = await getAnalyticsKeyAndUpdate(campaign, activeTab)
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [activeTab, campaign, getAnalyticsKeyAndUpdate])

  useEffect(() => {
    if (campaignMappedAnalytics) {
      setIsMapBtnShown(activeTab === 'country')

      // TODO: fix csf Data types an add the type to useState
      setCsvData(generateCVSData(analyticTypeToHeader(activeTab), campaignMappedAnalytics))
    }
  }, [activeTab, campaignMappedAnalytics])

  const handleTabChange = useCallback((value: AnalyticsType) => {
    // TODO: validate value if it is in AnalyticsType
    setActiveTab(value)
  }, [])

  // TODO: there is delay when updated analytics table is displayed after the tab is switched - add loading bars or something

  if (!id) {
    return <div>Invalid campaign ID</div>
  }

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
            <Tabs.Tab value="country">REGIONS</Tabs.Tab>
            <Tabs.Tab value="adUnit">CREATIVES</Tabs.Tab>
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
        {/** TODO: show loading, no data etc when no campaignMappedAnalytics/ analyticsKey */}
        <Tabs.Panel value="timeframe" pt="xs">
          <TimeFrame timeFrames={campaignMappedAnalytics} period={analyticsKey?.period} />
        </Tabs.Panel>
        <Tabs.Panel value="hostname" pt="xs">
          <Placements placements={campaignMappedAnalytics} />
        </Tabs.Panel>
        <Tabs.Panel value="country" pt="xs">
          <Regions
            regions={campaignMappedAnalytics}
            isMapVisible={isMapVisible}
            onClose={() => setIsMapVisible(false)}
          />
        </Tabs.Panel>
        <Tabs.Panel value="adUnit" pt="xs">
          <Creatives creatives={campaignMappedAnalytics} units={campaign?.adUnits} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
