import { useEffect, useState, useMemo } from 'react'
import {
  Select,
  Container,
  Loader
  //  Flex, Loader, Tabs
} from '@mantine/core'
import { BaseAnalyticsData, AnalyticsPeriod, Timeframe } from 'types'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import CustomTable from 'components/common/CustomTable'
import { CountryData } from 'helpers/countries'

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

  const [timeframe, setTimeframe] = useState<Timeframe>('year')

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
      const key = await getAnalyticsKeyAndUpdate('country', undefined, true, timeframe)
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [getAnalyticsKeyAndUpdate, timeframe])

  const loading = useMemo(
    () => !analyticsKey || !adminMappedAnalytics,
    [analyticsKey, adminMappedAnalytics]
  )

  const elements = useMemo(() => {
    const paid = adminMappedAnalytics?.reduce((sum, i) => sum + i.paid, 0) || 1
    const imps = adminMappedAnalytics?.reduce((sum, i) => sum + i.impressions, 0) || 1
    return (
      adminMappedAnalytics?.map((item) => ({
        segment: CountryData.get(item.segment)?.name,
        share: `${((item.paid / paid) * 100).toFixed(2)} %`,
        shareImps: `${((item.impressions / imps) * 100).toFixed(2)} %`,
        impressions: item.impressions,
        clicks: item.clicks,
        ctr: `${item.ctr} %`,
        avgCpm: `${item.avgCpm}`,
        paid: `${item.paid.toFixed(4)}`
      })) || []
    )
  }, [adminMappedAnalytics])

  return (
    <Container fluid>
      <Select
        value={timeframe}
        onChange={(val) => setTimeframe(val as Timeframe)}
        data={timeframeData}
        mb="sm"
      />
      {loading ? (
        <Loader size="xl" />
      ) : (
        <CustomTable background headings={headings} elements={elements} />
      )}
    </Container>
  )
}

export default AdminAnalytics
