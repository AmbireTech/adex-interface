import { useCallback, useEffect, useMemo, useState } from 'react'
import { Title, Flex, Text, Box, LoadingOverlay, Alert, Stack, Group, Paper } from '@mantine/core'
import TimeFrameChart from 'components/common/Chart/TimeFrameChart'
import { BaseAnalyticsData, FilteredAnalytics, MetricsToShow } from 'types'
import { formatCurrency } from 'helpers'
import { useViewportSize } from '@mantine/hooks'
import { useCampaignsAnalyticsData } from 'hooks/useCampaignAnalytics/useCampaignAnalyticsData'
import ChartControlBtn from './ChartControlBtn'

function sumArrayProperties(analytics: BaseAnalyticsData[]) {
  const sums = analytics.reduce(
    (sum, x) => {
      const next = { ...sum }
      next.clicks += x.clicks
      next.impressions += x.impressions
      next.paid += x.paid

      return next
    },
    { clicks: 0, impressions: 0, paid: 0 }
  )

  return {
    ...sums,
    ctr: (sums.clicks / sums.impressions) * 100,
    avgCpm: (sums.paid / sums.impressions) * 1000
  }
}

export const TimeFrame = ({ forAdmin, campaignId }: { forAdmin: boolean; campaignId: string }) => {
  const { campaignMappedAnalytics, analyticsKey, currencyName, loading, error } =
    useCampaignsAnalyticsData({
      campaignId,
      forAdmin,
      analyticsType: 'timeframe'
    })

  const { width: windowWidth } = useViewportSize()
  const [filteredData, setFilteredData] = useState<FilteredAnalytics[]>([])

  // console.log({ kors: Array.isArray(timeFrames) })

  const [metricsToShow, setMetricsToShow] = useState<MetricsToShow>({
    // segment: true,
    impressions: true,
    clicks: true,
    ctr: true,
    avgCpm: true,
    paid: true
  })

  useEffect(() => {
    if (campaignMappedAnalytics) {
      const result = campaignMappedAnalytics.map((obj) => {
        const filteredObj: FilteredAnalytics = {
          segment: new Date(Number(obj.segment)).toLocaleString()
        }

        Object.entries(metricsToShow).forEach(([metricKey, show]) => {
          if (show) {
            // TODO: fix it
            // @ts-ignore
            filteredObj[metricKey as keyof BaseAnalyticsData] =
              obj[metricKey as keyof BaseAnalyticsData]
          }
        })

        return filteredObj
      })
      setFilteredData(result)
    }
  }, [metricsToShow, campaignMappedAnalytics])

  const totalSum = useMemo(
    () =>
      campaignMappedAnalytics
        ? sumArrayProperties(campaignMappedAnalytics)
        : // TODO: default
          { clicks: 0, impressions: 0, avgCpm: 0, ctr: 0, paid: 0 },
    [campaignMappedAnalytics]
  )

  const handleMetricClick = useCallback((value: boolean, propNameToRemove: keyof MetricsToShow) => {
    setMetricsToShow((prev) => ({ ...prev, [propNameToRemove]: value }))
  }, [])

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />

      <Stack>
        {error && (
          <Alert
            variant="outline"
            color="error"
            title={typeof error === 'string' ? error : 'Error loading data'}
          />
        )}
        {!error && !filteredData.length && (
          <Alert variant="outline" color="info" title="No data found" />
        )}

        <Paper p="sm">
          <Group>
            <ChartControlBtn
              value={formatCurrency(totalSum.impressions, 0)}
              text="Total impressions"
              bgColor="chartColorOne"
              onClick={(v: boolean) => handleMetricClick(v, 'impressions')}
              whiteFontColor
            />

            <ChartControlBtn
              value={`${formatCurrency(totalSum.clicks, 0)} (${formatCurrency(
                totalSum.ctr,
                2
              )} % CTR)`}
              text="Total clicks & CTR"
              bgColor="chartColorTwo"
              onClick={(v: boolean) => handleMetricClick(v, 'clicks')}
              whiteFontColor
            />

            <ChartControlBtn
              value={`~ ${formatCurrency(totalSum.avgCpm, 3)} ${currencyName} / CPM`}
              text="Average CPM"
              bgColor="chartColorThree"
              onClick={(v: boolean) => handleMetricClick(v, 'avgCpm')}
              whiteFontColor
            />

            <ChartControlBtn
              value={`~ ${formatCurrency(totalSum.paid, 2)} ${currencyName}`}
              text="Total spent"
              bgColor="chartColorFour"
              onClick={(v: boolean) => handleMetricClick(v, 'paid')}
            />
          </Group>
        </Paper>

        <Paper p="sm">
          <Title order={5}>Chart</Title>

          <TimeFrameChart
            width={windowWidth >= 768 ? windowWidth - 315 : windowWidth - 100}
            height={420}
            timeFrameData={filteredData}
            metricsToShow={metricsToShow}
          />
          {analyticsKey?.period && (
            <Flex align="center" justify="space-between" ml="xl" mr="xl">
              <Text c="dimmed">Starts: {analyticsKey?.period.start?.toString()}</Text>
              <Text c="dimmed">Ends: {analyticsKey?.period.end?.toString()}</Text>
            </Flex>
          )}
        </Paper>
      </Stack>
    </Box>
  )
}
