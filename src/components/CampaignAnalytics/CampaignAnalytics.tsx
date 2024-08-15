import { useCallback, useEffect, useState } from 'react'
import { Container, Flex, Loader, Tabs, Paper, Group, Text, Anchor, Center } from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { AnalyticsType } from 'types'
import GoBack from 'components/common/GoBack/GoBack'
import DownloadCSV from 'components/common/DownloadCSV'
import { StickyPanel } from 'components/TopBar/TopBarStickyPanel'
import { AdminBadge } from 'components/common/AdminBadge'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import Placements from './Placements'
import Creatives from './Creatives'
import SSPs from './SSPs'
import Regions from './Regions'
import { TimeFrame } from './TimeFrame'
import { generateCVSData } from './CvsDownloadConfigurations'
import SeeOnMapBtn from './SeeOnMapBtn'

const CampaignAnalytics = ({ isAdminPanel = false }: { isAdminPanel?: boolean }) => {
  const { id, activeTab = 'timeframe' } = useParams<{ id: string; activeTab: AnalyticsType }>()

  const navigate = useNavigate()
  const [isMapBtnShown, setIsMapBtnShown] = useState<boolean>(false)
  const [isMapVisible, setIsMapVisible] = useState<boolean>(false)
  const [csvData, setCsvData] = useState<any | undefined>()

  const { campaignMappedAnalytics, totalPaid, campaign, loading, currencyName, analyticsKey } =
    useCampaignsAnalyticsData({
      campaignId: id || '',
      forAdmin: isAdminPanel,
      analyticsType: activeTab
    })

  useEffect(() => {
    if (campaignMappedAnalytics) {
      setIsMapBtnShown(activeTab === 'country')

      // TODO: fix csf Data types an add the type to useState
      setCsvData(generateCVSData(activeTab, campaignMappedAnalytics))
    }
  }, [activeTab, campaignMappedAnalytics])

  const handleTabChange = useCallback(
    (value: string | null) => {
      campaign?.id &&
        navigate(
          `/dashboard/campaign-analytics${isAdminPanel ? '/admin' : ''}/${campaign?.id}/${value}`,
          { replace: true }
        )
    },
    [campaign?.id, isAdminPanel, navigate]
  )

  // TODO: there is delay when updated analytics table is displayed after the tab is switched - add loading bars or something

  if (loading && !campaign) {
    return (
      <Center>
        <Loader />
      </Center>
    )
  }

  if (!id || (!loading && !campaign)) {
    return <div>Invalid campaign ID</div>
  }

  // TODO: better tabs optimization, this si temp fix that prevents 80-90% of the prev re-renders, there is sill 1 extra re-rended that can be fixed

  return (
    <Container fluid>
      <StickyPanel>
        <Paper mx="auto" shadow="xl" radius="xl">
          <Group justify="space-between">
            <GoBack title="Go Back" />
            <Text size="sm" truncate>
              Campaign: {campaign?.title}
              {isAdminPanel && (
                <Anchor
                  underline="never"
                  size="xs"
                  href={`/dashboard/admin/user-account/${campaign?.owner}`}
                  c="secondaryText"
                >
                  {' '}
                  ({campaign?.owner})
                </Anchor>
              )}
            </Text>
            <Group align="center" justify="space-between">
              {isMapBtnShown && (
                <SeeOnMapBtn onBtnClicked={() => setIsMapVisible((prev) => !prev)} />
              )}
              {csvData && activeTab !== 'timeframe' && (
                <DownloadCSV
                  data={csvData.tabData}
                  mapHeadersToDataProperties={csvData.mapHeadersToDataProperties}
                  filename={csvData.filename}
                />
              )}
            </Group>
          </Group>
        </Paper>
        {isAdminPanel && <AdminBadge title="Admin Campaign Analytics" />}
      </StickyPanel>

      <Tabs color="brand" value={activeTab} onChange={handleTabChange} py="sm" keepMounted={false}>
        <Flex justify="space-between" align="baseline">
          <Tabs.List>
            <Tabs.Tab value="timeframe">TIME FRAME</Tabs.Tab>
            <Tabs.Tab value="hostname">PLACEMENTS</Tabs.Tab>
            <Tabs.Tab value="country">REGIONS</Tabs.Tab>
            <Tabs.Tab value="adUnit">CREATIVES</Tabs.Tab>
            {isAdminPanel && <Tabs.Tab value="ssp">SSPs</Tabs.Tab>}
          </Tabs.List>
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
      {!loading && campaign && activeTab === 'hostname' && (
        <Placements
          placements={campaignMappedAnalytics}
          currencyName={currencyName}
          // NOTE: currently we have only have one placement per campaign
          // TODO; this can be get from analytics but that means 2x request to validator
          placement={campaign?.targetingInput.inputs.placements.in[0] || 'site'}
          campaign={campaign}
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
      {isAdminPanel && !loading && activeTab === 'ssp' && (
        <SSPs data={campaignMappedAnalytics} currencyName={currencyName} />
      )}
    </Container>
  )
}

export default CampaignAnalytics
