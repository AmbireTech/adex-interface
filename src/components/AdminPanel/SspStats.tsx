import { useCallback, useState, useEffect, useMemo } from 'react'
import { SimpleGrid, Box, Tabs, Paper, Loader } from '@mantine/core'
import { useAdExApi } from 'hooks/useAdexServices'
import useCustomNotifications from 'hooks/useCustomNotifications'

import { SupplyStats, SupplyStatsDetails } from 'types'
import CustomTable from 'components/common/CustomTable'

const supplyStatsDefaultValue = {
  appBannerFormats: [],
  siteBannerFormatsDesktop: [],
  siteBannerFormatsMobile: [],
  appBidFloors: [],
  siteDesktopBidFloors: [],
  siteMobileBidFloors: []
}
const toTableDta = (stats: SupplyStatsDetails[], title: string) => {
  return {
    headings: [title, 'count'],
    elements: stats
      .slice(0, 200)
      .map(({ value, count }) => ({ value, count: count.toLocaleString() }))
  }
}

function SspStats() {
  const { adexServicesRequest } = useAdExApi()
  const { showNotification } = useCustomNotifications()
  const [supplyStats, setSupplyStats] = useState<SupplyStats>(supplyStatsDefaultValue)

  const getSupplyStats = useCallback(async () => {
    let result

    try {
      result = await adexServicesRequest('backend', {
        route: '/dsp/stats/common',
        method: 'GET'
      })

      if (!result) {
        throw new Error('Getting banner sizes failed.')
      }

      setSupplyStats(result as SupplyStats)
    } catch (e) {
      console.error(e)
      showNotification('error', 'Error getting supply stats')
    }
  }, [adexServicesRequest, showNotification])

  useEffect(() => {
    getSupplyStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      appBidFloors: toTableDta(appBidFloors, 'App Bid Floor'),
      siteDesktopBidFloors: toTableDta(siteDesktopBidFloors, 'Desktop site  bid floor'),
      siteMobileBidFloors: toTableDta(siteMobileBidFloors, 'Mobil site bid floor')
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
          {loading && <Loader size="sm" variant="dots" />}

          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: 'xl', cols: 2, spacing: 'xl' },
              { maxWidth: 'md', cols: 1, spacing: 'xl' }
            ]}
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
          {loading && <Loader size="sm" variant="dots" />}

          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: 'xl', cols: 2, spacing: 'xl' },
              { maxWidth: 'md', cols: 1, spacing: 'xl' }
            ]}
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
          {loading && <Loader size="sm" variant="dots" />}

          <SimpleGrid
            cols={2}
            breakpoints={[
              { maxWidth: 'xl', cols: 2, spacing: 'xl' },
              { maxWidth: 'md', cols: 1, spacing: 'xl' }
            ]}
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
