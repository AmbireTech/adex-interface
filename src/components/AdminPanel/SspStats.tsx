import { useMemo } from 'react'
import { SimpleGrid, Box, Tabs, Paper, Loader } from '@mantine/core'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { SupplyStatsDetails } from 'types'
import CustomTable from 'components/common/CustomTable'
import { parseRange } from 'helpers/createCampaignHelpers'

const toTableDta = (stats: SupplyStatsDetails[], title: string, isCpmRange?: boolean) => {
  return {
    headings: [title, 'count'],
    elements: stats.slice(0, 200).map(({ value, count }) => ({
      value: isCpmRange
        ? JSON.stringify(parseRange(value), null, 4).replace(/\{|\}|"/g, '')
        : value,
      count: count.toLocaleString()
    }))
  }
}

function SspStats() {
  const { supplyStats } = useCampaignsData()

  const data = useMemo(() => {
    const {
      appBannerFormats,
      siteBannerFormatsMobile,
      siteBannerFormatsDesktop,
      appBidFloors,
      siteDesktopBidFloors,
      siteMobileBidFloors
    } = supplyStats

    return {
      appBannerFormats: toTableDta(appBannerFormats, 'App Format'),
      siteBannerFormatsMobile: toTableDta(siteBannerFormatsMobile, 'Mobile site Format'),
      siteBannerFormatsDesktop: toTableDta(siteBannerFormatsDesktop, 'Desktop site Format'),
      appBidFloors: toTableDta(appBidFloors, 'App Bid Floor', true),
      siteDesktopBidFloors: toTableDta(siteDesktopBidFloors, 'Desktop site  bid floor', true),
      siteMobileBidFloors: toTableDta(siteMobileBidFloors, 'Mobil site bid floor', true)
    }
  }, [supplyStats])

  const loading = useMemo(
    () => !supplyStats.appBannerFormats.length,
    [supplyStats.appBannerFormats.length]
  )

  return (
    <Box>
      <Tabs keepMounted={false} defaultValue="app" orientation="vertical">
        <Tabs.List>
          <Tabs.Tab value="app">Apps </Tabs.Tab>
          <Tabs.Tab value="mobile">Mobile sites</Tabs.Tab>
          <Tabs.Tab value="desktop">Desktop sites</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="app" pl="xs">
          {loading && <Loader size="sm" type="dots" />}

          <SimpleGrid
            cols={{ md: 1, xl: 2 }}
            spacing="xl"
            // cols={2}
            // breakpoints={[
            //   { maxWidth: 'xl', cols: 2, spacing: 'xl' },
            //   { maxWidth: 'md', cols: 1, spacing: 'xl' }
            // ]}
          >
            <Paper p="sm" withBorder>
              <CustomTable pageSize={10} {...data.appBannerFormats} />
            </Paper>
            <Paper p="sm" withBorder>
              <CustomTable pageSize={10} {...data.appBidFloors} />
            </Paper>
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="mobile" pl="xs">
          {loading && <Loader size="sm" type="dots" />}

          <SimpleGrid
            cols={{ md: 1, xl: 2 }}
            spacing="xl"
            // cols={2}
            // breakpoints={[
            //   { maxWidth: 'xl', cols: 2, spacing: 'xl' },
            //   { maxWidth: 'md', cols: 1, spacing: 'xl' }
            // ]}
          >
            <Paper p="sm" withBorder>
              <CustomTable pageSize={10} {...data.siteBannerFormatsMobile} />
            </Paper>
            <Paper p="sm" withBorder>
              <CustomTable pageSize={10} {...data.siteMobileBidFloors} />
            </Paper>
          </SimpleGrid>
        </Tabs.Panel>

        <Tabs.Panel value="desktop" pl="xs">
          {loading && <Loader size="sm" type="dots" />}

          <SimpleGrid
            cols={{ md: 1, xl: 2 }}
            spacing="xl"
            // cols={2}
            // breakpoints={[
            //   { maxWidth: 'xl', cols: 2, spacing: 'xl' },
            //   { maxWidth: 'md', cols: 1, spacing: 'xl' }
            // ]}
          >
            <Paper p="sm" withBorder>
              <CustomTable pageSize={10} {...data.siteBannerFormatsDesktop} />
            </Paper>
            <Paper p="sm" withBorder>
              <CustomTable pageSize={10} {...data.siteDesktopBidFloors} />
            </Paper>
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}

export { SspStats }
