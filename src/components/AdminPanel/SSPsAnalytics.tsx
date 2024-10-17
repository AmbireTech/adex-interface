import { useEffect, useState, useMemo } from 'react'
import { Select, Stack, Group, Box, Badge } from '@mantine/core'
import { SSPs, RequestStatPlacement, SSPsAnalyticsDataQuery } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'
import CustomTable, { DataElement } from 'components/common/CustomTable'
import { removeOptionalEmptyStringProps } from 'helpers'
import DownloadCSV from 'components/common/DownloadCSV'

const sspsData: Array<{ value: SSPs | ''; label: string }> = [
  { value: '', label: 'All SSPs' },
  { value: 'Eskimi', label: 'Eskimi' },
  { value: 'Epom', label: 'Epom' },
  { value: 'Qortex', label: 'Qortex' }
]

const placementsData: Array<{ value: string; label: string }> = [
  { value: '', label: 'All placements' },
  { value: RequestStatPlacement.app.toString(), label: 'App' },
  { value: RequestStatPlacement.siteMobile.toString(), label: 'Site - Mobile' },
  { value: RequestStatPlacement.siteDesktop.toString(), label: 'Site - Desktop' },
  { value: RequestStatPlacement.other.toString(), label: 'Site - other' }
]

const groupByData: Array<{ value: string; label: string }> = [
  { value: 'date', label: 'date' },
  { value: 'category', label: 'category' },
  { value: 'publisher', label: 'publisher' },
  { value: 'placement', label: 'placement' },
  { value: 'country', label: 'country' },
  { value: 'ssp', label: 'ssp' },
  { value: 'format', label: 'format' }
]

const SSPsAnalytics = () => {
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
      }
    | undefined
  >()

  const [ssp, setSsp] = useState<SSPs>('')
  const [groupBy, setGrop] = useState<SSPsAnalyticsDataQuery['groupBy']>('country')
  const [placement, setPlacement] = useState<RequestStatPlacement | ''>('')
  const { analyticsData, getAnalyticsKeyAndUpdate } = useSSPsAnalytics()

  const analytics = useMemo(
    () => analyticsData.get(analyticsKey?.key || ''),
    [analyticsData, analyticsKey]
  )

  useEffect(() => {
    console.log({ analytics })
  }, [analytics])

  useEffect(() => {
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      const key = await getAnalyticsKeyAndUpdate({
        ...removeOptionalEmptyStringProps({
          ssp,
          placement
        }),
        groupBy
      })
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [getAnalyticsKeyAndUpdate, groupBy, placement, ssp])

  const loading = useMemo(() => analytics?.status === 'loading', [analytics])

  const data: { elements: DataElement[]; totalRequests: number } = useMemo(() => {
    return {
      elements:
        analytics?.data.map(({ count, value }) => {
          return {
            id: value.toString() + count.toString(),
            columns: [
              { value: value.toString(), label: value.toString() },
              { value: count, label: value.toString() }
            ]
          }
        }) || [],
      totalRequests: analytics?.data.reduce((sum, i) => sum + i.count, 0) || 0
    }
  }, [analytics])

  return (
    <Stack gap="xs">
      <Group align="start" justify="left" gap="xs">
        <Select
          label="Group by"
          value={groupBy}
          onChange={(val) => setGrop(val as SSPsAnalyticsDataQuery['groupBy'])}
          data={groupByData}
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
          label="Placement"
          value={placement?.toString()}
          // @ts-ignore
          onChange={(val) => setPlacement(val !== '' ? Number(val) : val)}
          data={placementsData}
          size="md"
        />
      </Group>
      <Group align="center" justify="left" gap="xs" pos="relative">
        <Box>Totals: </Box>

        <Badge size="lg" leftSection="Total requests">
          {data.totalRequests.toLocaleString()}
        </Badge>

        <DownloadCSV
          // TODO: fix anal type
          // @ts-ignore
          data={analytics?.data.map((x) => ({
            value: x.count,
            segment: x.value.toString()
          }))}
          // mapHeadersToDataProperties={{ [analType]: 'segment', ...csvHeaders }}
          filename={`${analyticsKey?.key || 'admin-data-export'}.csv`}
          disabled={loading}
        />
      </Group>
      <Stack>
        <CustomTable
          pageSize={10}
          headings={[groupBy?.toString() || 'data', 'count']}
          data={data.elements}
          loading={loading}
        />
      </Stack>
    </Stack>
  )
}

export default SSPsAnalytics
