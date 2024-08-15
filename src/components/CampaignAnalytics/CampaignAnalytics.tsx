import { useCallback } from 'react'
import { Container, Flex, Tabs, Paper, Group } from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { AnalyticsType } from 'types'
// import GoBack from 'components/common/GoBack/GoBack'
// import DownloadCSV from 'components/common/DownloadCSV'
import { StickyPanel } from 'components/TopBar/TopBarStickyPanel'
import { AdminBadge } from 'components/common/AdminBadge'
import Placements from './Placements'
import Creatives from './Creatives'
// import SSPs from './SSPs'
import Regions from './Regions'
import { TimeFrame } from './TimeFrame'
// import { generateCVSData } from './CvsDownloadConfigurations'

const CampaignAnalytics = ({ isAdminPanel = false }: { isAdminPanel?: boolean }) => {
  const { id, activeTab = 'timeframe' } = useParams<{ id: string; activeTab: AnalyticsType }>()

  const navigate = useNavigate()
  // const [csvData, setCsvData] = useState<any | undefined>()

  // useEffect(() => {
  //   if (campaignMappedAnalytics) {
  //     // TODO: fix csf Data types an add the type to useState
  //     // setCsvData(generateCVSData(activeTab, campaignMappedAnalytics))
  //   }
  // }, [activeTab, campaignMappedAnalytics])

  const handleTabChange = useCallback(
    (value: string | null) => {
      id &&
        navigate(`/dashboard/campaign-analytics${isAdminPanel ? '/admin' : ''}/${id}/${value}`, {
          replace: true
        })
    },
    [id, isAdminPanel, navigate]
  )

  if (!id) {
    return <div>Invalid campaign ID</div>
  }

  // TODO: better tabs optimization, this si temp fix that prevents 80-90% of the prev re-renders, there is sill 1 extra re-rended that can be fixed

  return (
    <Container fluid>
      <StickyPanel>
        <Paper mx="auto" shadow="xl" radius="xl">
          <Group justify="space-between">
            {/* <GoBack title="Go Back" />
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
              {csvData && activeTab !== 'timeframe' && (
                <DownloadCSV
                  data={csvData.tabData}
                  mapHeadersToDataProperties={csvData.mapHeadersToDataProperties}
                  filename={csvData.filename}
                />
              )}
            </Group> */}
          </Group>
        </Paper>
        {isAdminPanel && <AdminBadge title="Admin Campaign Analytics" />}
      </StickyPanel>

      <Tabs color="brand" value={activeTab} onChange={handleTabChange} py="sm" keepMounted={false}>
        <Flex justify="space-between" align="baseline">
          <Tabs.List mb="md">
            <Tabs.Tab value="timeframe">TIME FRAME</Tabs.Tab>
            <Tabs.Tab value="hostname">PLACEMENTS</Tabs.Tab>
            <Tabs.Tab value="country">REGIONS</Tabs.Tab>
            <Tabs.Tab value="adUnit">CREATIVES</Tabs.Tab>
            {isAdminPanel && <Tabs.Tab value="ssp">SSPs</Tabs.Tab>}
          </Tabs.List>
        </Flex>
        <Tabs.Panel value="timeframe">
          <TimeFrame campaignId={id} />
        </Tabs.Panel>
        <Tabs.Panel value="hostname">
          <Placements campaignId={id} forAdmin={isAdminPanel} />
        </Tabs.Panel>
        <Tabs.Panel value="country">
          <Regions campaignId={id} />
        </Tabs.Panel>
        <Tabs.Panel value="adUnit">
          <Creatives campaignId={id} />
        </Tabs.Panel>
        {/* {isAdminPanel && !loading && activeTab === 'ssp' && (
        <SSPs data={campaignMappedAnalytics} currencyName={currencyName} />
      )} */}
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
