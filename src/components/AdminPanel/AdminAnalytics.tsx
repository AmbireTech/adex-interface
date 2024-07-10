import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Select,
  Container,
  Loader,
  Flex,
  Box,
  Text,
  Badge,
  ActionIcon

  //  Flex, Loader, Tabs
} from '@mantine/core'
import { BaseAnalyticsData, AnalyticsPeriod, Timeframe, AnalyticsType, SSPs } from 'types'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import CustomTable from 'components/common/CustomTable'
import { CountryData } from 'helpers/countries'
import { DateTimePicker, DateInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import BillingIcon from 'resources/icons/Billing'
import VisibilityIcon from 'resources/icons/Visibility'
import { getHumneSrcName } from 'helpers'
import CheckMarkFilledIcon from 'resources/icons/CheckMarkFilled'

const headingsDefault = [
  //   'Country',
  'Share (Spent)',
  'Share (Impressions)',
  'Impressions',
  'Clicks',
  'CTR',
  'Avg CPM',
  'Avg CPC',
  'Spent'
]

const timeframeData: Array<{ value: Timeframe; label: Timeframe }> = [
  { value: 'year', label: 'year' },
  { value: 'month', label: 'month' },
  { value: 'week', label: 'week' },
  { value: 'day', label: 'day' }
]

const analyticsTypeData: Array<{ value: AnalyticsType; label: string }> = [
  { value: 'country', label: 'By country' },
  { value: 'ssp', label: 'By SSP' },
  { value: 'adUnit', label: 'By Ad unit' },
  { value: 'hostname', label: 'By hostname' },
  { value: 'placement', label: 'By placement' },
  { value: 'campaignId', label: 'By campaign id' },
  { value: 'advertiser', label: 'By advertiser' },
  { value: 'timeframe', label: 'By Timeframe' }
]

const sspsData: Array<{ value: SSPs; label: string }> = [
  { value: '', label: 'All SSPs' },
  { value: 'Eskimi', label: 'Eskimi' },
  { value: 'Epom', label: 'Epom' },
  { value: 'Qortex', label: 'Qortex' }
]

const mapSegmentLabel = (analType: AnalyticsType, segment: string): { segementLabel: string } => {
  let segementLabel = segment

  switch (analType) {
    case 'country':
      segementLabel = CountryData.get(segment)?.name || segment
      break
    case 'timeframe':
      segementLabel = new Date(Number(segment)).toUTCString()
      break
    case 'hostname':
      // TODO: separate calls for app/site - will require more work
      segementLabel = getHumneSrcName(segment, 'app')
      break

    default:
      break
  }

  return {
    segementLabel
  }
}

const AdminAnalytics = () => {
  const navigate = useNavigate()

  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
        period: AnalyticsPeriod
      }
    | undefined
  >()

  const [timeframe, setTimeframe] = useState<Timeframe>('month')
  const [analType, setAnalType] = useState<AnalyticsType>('ssp')
  const [ssp, setSsp] = useState<SSPs>('')
  const [startDate, setStartDate] = useState<Date | null>(
    dayjs().subtract(1, 'month').startOf('month').toDate()
  )
  const [endDate, setEndDate] = useState<Date | null>(
    dayjs().subtract(1, 'month').endOf('month').toDate()
  )

  const maxDate = useMemo(() => {
    return new Date()
  }, [])

  const headings = useMemo(() => [analType.toString(), ...headingsDefault], [analType])

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

    const end = dayjs(
      Math.min(dayjs(startDate).add(1, timeframe).subtract(1, 'ms').valueOf(), dayjs().valueOf())
    ).toDate()
    setEndDate(end)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate(
        analType,
        undefined,
        true,
        timeframe,
        startDate || undefined,
        end || undefined,
        ssp || undefined
      )
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [analType, getAnalyticsKeyAndUpdate, ssp, startDate, timeframe])

  const loading = useMemo(
    () => !analyticsKey || !adminMappedAnalytics,
    [analyticsKey, adminMappedAnalytics]
  )

  const data = useMemo(() => {
    const paid = adminMappedAnalytics?.reduce((sum, i) => sum + i.paid, 0) || 1
    const imps = adminMappedAnalytics?.reduce((sum, i) => sum + i.impressions, 0) || 1
    const clicks = adminMappedAnalytics?.reduce((sum, i) => sum + i.clicks, 0) || 1
    return {
      paid,
      imps,
      clicks,
      elements:
        adminMappedAnalytics?.map((item) => ({
          id: item.segment.toString(),
          segment: mapSegmentLabel(analType, item.segment).segementLabel,
          share: `${((item.paid / paid) * 100).toFixed(2)} %`,
          shareImps: `${((item.impressions / imps) * 100).toFixed(2)} %`,
          impressions: item.impressions,
          clicks: item.clicks,
          ctr: `${item.ctr} %`,
          avgCpm: `${item.avgCpm}`,
          avgCPC: item.clicks ? (item.paid / item.clicks).toFixed(4) : '-',
          paid: `${item.paid.toFixed(4)}`
        })) || []
    }
  }, [adminMappedAnalytics, analType])

  const handlePreview = useCallback(
    (cmp: { id: string }) => {
      return navigate(`/dashboard/campaign-details/admin/${cmp.id}`, {})
    },
    [navigate]
  )

  return (
    <Container fluid>
      <Text size="sm" mb="sm">
        * This analytics are for the actual user campaign, representing placed impressions, clicks,
        etc. (NOT the stats form received requests form the SSPs)
      </Text>

      <Flex direction="row" align="center" justify="left" gap="xl" mb="md">
        <Select
          label="Type"
          value={analType}
          onChange={(val) => setAnalType(val as AnalyticsType)}
          data={analyticsTypeData}
          size="md"
        />
        <Select
          label="SSP"
          value={ssp}
          onChange={(val) => setSsp(val as SSPs)}
          data={sspsData}
          size="md"
        />
        <Select
          label="Period"
          value={timeframe}
          onChange={(val) => setTimeframe(val as Timeframe)}
          data={timeframeData}
          size="md"
        />
        <DateInput
          label="Start date"
          placeholder="Start date"
          value={startDate}
          onChange={setStartDate}
          maxDate={maxDate}
          size="md"
        />
        <DateTimePicker
          label="End date"
          placeholder="Start date"
          value={endDate}
          disabled
          withSeconds
          size="md"
        />
      </Flex>

      {loading ? (
        <Loader size="xl" variant="dots" color="violet" />
      ) : (
        <Flex direction="column">
          <Flex direction="row" align="center" justify="left" gap="xl" mb="md">
            <Box>Totals: </Box>
            <Box>
              <Badge
                leftSection={
                  <ActionIcon size="sm" color="brand">
                    <BillingIcon />
                  </ActionIcon>
                }
                size="xl"
              >
                {Number(data.paid.toFixed(2)).toLocaleString()}
              </Badge>
            </Box>
            <Box>
              <Badge
                size="xl"
                leftSection={
                  <ActionIcon size="sm" color="brand">
                    <VisibilityIcon />
                  </ActionIcon>
                }
              >
                {' '}
                {data.imps.toLocaleString()}
              </Badge>
            </Box>
            <Box>
              <Badge
                size="xl"
                leftSection={
                  <ActionIcon size="sm" color="brand">
                    <CheckMarkFilledIcon />
                  </ActionIcon>
                }
              >
                {' '}
                {data.clicks.toLocaleString()}
              </Badge>
            </Box>
          </Flex>
          <CustomTable
            background
            headings={headings}
            elements={data.elements}
            pageSize={10}
            onPreview={analType === 'campaignId' ? handlePreview : undefined}
          />
        </Flex>
      )}
    </Container>
  )
}

export default AdminAnalytics
