import { useCallback, useEffect, useState, useMemo } from 'react'
import { Container, Flex, Loader, Tabs } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { AnalyticsType, BaseAnalyticsData, AnalyticsPeriod } from 'types'
import GoBack from 'components/common/GoBack/GoBack'
import DownloadCSV from 'components/common/DownloadCSV'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { Campaign } from 'adex-common'
import useAccount from 'hooks/useAccount'
import Placements from './Placements'
import Creatives from './Creatives'
import SSPs from './SSPs'
import Regions from './Regions'
import { TimeFrame } from './TimeFrame'
import { generateCVSData } from './CvsDownloadConfigurations'
import SeeOnMapBtn from './SeeOnMapBtn'

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
  const {
    adexAccount: {
      fundsOnCampaigns: { perCampaign }
    },
    isAdmin
  } = useAccount()

  const currencyName = useMemo(
    () =>
      id && !!perCampaign.length
        ? perCampaign.find((item) => item.id === id)?.token.name || ''
        : '',
    [id, perCampaign]
  )

  const campaign: Campaign | undefined = useMemo(
    () => (id ? campaignsData.get(id)?.campaign : undefined),
    [id, campaignsData]
  )

  const totalPaid: number = useMemo(
    () => (id ? campaignsData.get(id)?.paid || 0 : 0),
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
    setAnalyticsKey(undefined)

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
      setCsvData(generateCVSData(activeTab, campaignMappedAnalytics))
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

  const loading = useMemo(
    () => !analyticsKey || !campaignMappedAnalytics,
    [analyticsKey, campaignMappedAnalytics]
  )

  // TODO: better tabs optimization, this si temp fix that prevents 80-90% of the prev re-renders, there is sill 1 extra re-rended that can be fixed

  return (
    <Container fluid>
      <GoBack title="Dashboard" />
      <Tabs
        color="brand"
        value={activeTab}
        onTabChange={handleTabChange}
        styles={() => ({
          tabsList: { border: 'none', padding: '20px 0' }
        })}
        keepMounted={false}
      >
        <Flex justify="space-between" align="baseline">
          <Tabs.List>
            <Tabs.Tab value="timeframe">TIME FRAME</Tabs.Tab>
            <Tabs.Tab value="hostname">PLACEMENTS</Tabs.Tab>
            <Tabs.Tab value="country">REGIONS</Tabs.Tab>
            <Tabs.Tab value="adUnit">CREATIVES</Tabs.Tab>
            {isAdmin && <Tabs.Tab value="ssp">SSPs</Tabs.Tab>}
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
        {loading && (
          <Flex justify="center" align="center" mt={69}>
            <Loader size="xl" />
          </Flex>
        )}
      </Tabs>

      {}
      {!loading && activeTab === 'timeframe' && (
        <TimeFrame
          timeFrames={campaignMappedAnalytics}
          period={analyticsKey?.period}
          currencyName={currencyName}
        />
      )}
      {!loading && activeTab === 'hostname' && (
        <Placements
          placements={campaignMappedAnalytics}
          currencyName={currencyName}
          // NOTE: currently we have only have one placement per campaign
          // TODO; this can be get from analytics but that means 2x request to validator
          placement={campaign?.targetingInput.inputs.placements.in[0] || 'site'}
        />
      )}
      {!loading && activeTab === 'country' && (
        <Regions
          regions={campaignMappedAnalytics}
          isMapVisible={isMapVisible}
          currencyName={currencyName}
          totalPaid={totalPaid}
          onClose={() => setIsMapVisible(false)}
        />
      )}
      {!loading && activeTab === 'adUnit' && (
        <Creatives
          creatives={campaignMappedAnalytics}
          units={campaign?.adUnits}
          currencyName={currencyName}
        />
      )}
      {isAdmin && !loading && activeTab === 'ssp' && (
        <SSPs data={campaignMappedAnalytics} currencyName={currencyName} />
      )}
    </Container>
  )
}

export default CampaignAnalytics
