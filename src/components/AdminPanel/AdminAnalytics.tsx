import { useEffect, useState, useMemo } from 'react'
import {
  Select,
  Container,
  Loader,
  Flex,
  Box
  //  Flex, Loader, Tabs
} from '@mantine/core'
import { BaseAnalyticsData, AnalyticsPeriod, Timeframe } from 'types'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import CustomTable from 'components/common/CustomTable'
import { CountryData } from 'helpers/countries'
import { DatePickerInput } from '@mantine/dates'
import dayjs from 'dayjs'

const headings = [
  'Country',
  'Share (Spent)',
  'Share (Impressions)',
  'Impressions',
  'Clicks',
  'CTR',
  'Average CPM',
  'Spent'
]

const timeframeData: Array<{ value: Timeframe; label: Timeframe }> = [
  { value: 'year', label: 'year' },
  { value: 'month', label: 'month' },
  { value: 'week', label: 'week' },
  { value: 'day', label: 'day' }
]

const AdminAnalytics = () => {
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
        period: AnalyticsPeriod
      }
    | undefined
  >()

  const [timeframe, setTimeframe] = useState<Timeframe>('month')
  const [startDate, setStartDate] = useState<Date | null>(
    dayjs().subtract(1, 'month').startOf('month').toDate()
  )

  // TODO: change campaign analytics to analytics
  const { analyticsData, getAnalyticsKeyAndUpdate, mappedAnalytics } = useCampaignAnalytics()

  const analytics = useMemo(
    () => analyticsData.get(analyticsKey?.key || ''),
    [analyticsData, analyticsKey]
  )

  const adminMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || ''),
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    console.log({ analytics })
    console.log({ mappedAnalytics })
  }, [analytics, mappedAnalytics])

  useEffect(() => {
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate('timeframe', undefined, true, timeframe)
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [getAnalyticsKeyAndUpdate, timeframe])

  const loading = useMemo(
    () => !analyticsKey || !adminMappedAnalytics,
    [analyticsKey, adminMappedAnalytics]
  )

  const data = useMemo(() => {
    const paid = adminMappedAnalytics?.reduce((sum, i) => sum + i.paid, 0) || 1
    const imps = adminMappedAnalytics?.reduce((sum, i) => sum + i.impressions, 0) || 1
    return {
      paid,
      imps,
      elements:
        adminMappedAnalytics?.map((item) => ({
          segment:
            CountryData.get(item.segment)?.name ||
            new Date(Number(item.segment)).toLocaleString() ||
            item.segment,
          share: `${((item.paid / paid) * 100).toFixed(2)} %`,
          shareImps: `${((item.impressions / imps) * 100).toFixed(2)} %`,
          impressions: item.impressions,
          clicks: item.clicks,
          ctr: `${item.ctr} %`,
          avgCpm: `${item.avgCpm}`,
          paid: `${item.paid.toFixed(4)}`
        })) || []
    }
  }, [adminMappedAnalytics])

  return (
    <Container fluid>
      <Flex direction="row" align="centers" justify="left">
        <Select
          label="Period"
          value={timeframe}
          onChange={(val) => setTimeframe(val as Timeframe)}
          data={timeframeData}
          mb="sm"
        />
        <DatePickerInput
          label="Start date"
          placeholder="Start date"
          value={startDate}
          onChange={setStartDate}
          mx="auto"
          maw={400}
        />
      </Flex>

      {loading ? (
        <Loader size="xl" />
      ) : (
        <Flex direction="column">
          <Flex direction="row" align="centers" justify="left" gap="xl" mb="md">
            <Box>Total amount: {Number(data.paid.toFixed(2)).toLocaleString()}</Box>
            <Box>Total impressions: {data.imps.toLocaleString()}</Box>
          </Flex>
          <CustomTable background headings={headings} elements={data.elements} pageSize={31} />
        </Flex>
      )}
    </Container>
  )
}

export default AdminAnalytics
