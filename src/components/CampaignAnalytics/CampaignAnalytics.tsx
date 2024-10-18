import { useCallback, useMemo } from 'react'
import { Container, Flex, Tabs, Paper, Group, Text, Anchor } from '@mantine/core'
import { useParams, useNavigate } from 'react-router-dom'
import { AnalyticsType } from 'types'
import GoBack from 'components/common/GoBack/GoBack'
// import DownloadCSV from 'components/common/DownloadCSV'
import { StickyPanel } from 'components/TopBar/TopBarStickyPanel'
import { AdminBadge } from 'components/common/AdminBadge'
import { useCampaignsData } from 'hooks/useCampaignsData'
import SSPsAnalytics from 'components/AdminPanel/SSPsAnalytics'
import { IabTaxonomyV3 } from 'adex-common'
import Placements from './Placements'
import Creatives from './Creatives'
import SSPs from './SSPs'
import Regions from './Regions'
import { TimeFrame } from './TimeFrame'

const CampaignAnalytics = ({ isAdminPanel = false }: { isAdminPanel?: boolean }) => {
  const { id, activeTab = 'timeframe' } = useParams<{ id: string; activeTab: AnalyticsType }>()
  const { campaignsData } = useCampaignsData()
  const campaign = useMemo(
    () => (id ? campaignsData.get(id)?.campaign : undefined),
    [campaignsData, id]
  )

  const navigate = useNavigate()

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

  return (
    <Container fluid>
      <StickyPanel>
        <Paper mx="auto" shadow="xl" radius="xl">
          <Group justify="space-between" pr="md">
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
            {isAdminPanel && <Tabs.Tab value="sspAnalytics">SSPs request analytics</Tabs.Tab>}
          </Tabs.List>
        </Flex>
        <Tabs.Panel value="timeframe">
          <TimeFrame campaignId={id} forAdmin={isAdminPanel} />
        </Tabs.Panel>
        <Tabs.Panel value="hostname">
          <Placements campaignId={id} forAdmin={isAdminPanel} />
        </Tabs.Panel>
        <Tabs.Panel value="country">
          <Regions campaignId={id} forAdmin={isAdminPanel} />
        </Tabs.Panel>
        <Tabs.Panel value="adUnit">
          <Creatives campaignId={id} forAdmin={isAdminPanel} />
        </Tabs.Panel>
        <Tabs.Panel value="ssp">
          <SSPs campaignId={id} forAdmin={isAdminPanel} />
        </Tabs.Panel>
        <Tabs.Panel value="sspAnalytics">
          <SSPsAnalytics
            category={{
              values:
                campaign?.targetingInput.inputs.categories.apply === 'all'
                  ? []
                  : (campaign?.targetingInput.inputs.categories[
                      campaign?.targetingInput.inputs.categories.apply
                    ] as IabTaxonomyV3[]),
              operator:
                campaign?.targetingInput.inputs.categories.apply === 'all'
                  ? undefined
                  : campaign?.targetingInput.inputs.categories.apply
            }}
            country={{
              values:
                campaign?.targetingInput.inputs.location.apply === 'all'
                  ? []
                  : campaign?.targetingInput.inputs.location[
                      campaign?.targetingInput.inputs.location.apply
                    ],
              operator:
                campaign?.targetingInput.inputs.location.apply === 'all'
                  ? undefined
                  : campaign?.targetingInput.inputs.location.apply
            }}
            format={campaign?.adUnits.map((x) => `${x.banner?.format.h}x${x.banner?.format.w}`)}
          />
        </Tabs.Panel>
      </Tabs>
    </Container>
  )
}

export default CampaignAnalytics
