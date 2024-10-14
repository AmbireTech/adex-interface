import { useEffect, useState, useMemo } from 'react'
import { Select, Stack, Group, Code, Loader } from '@mantine/core'
import { SSPs } from 'types'
import useSSPsAnalytics from 'hooks/useCampaignAnalytics/useSSPsAnalytics'

enum RequestStatPlacement {
  app = 1,
  siteMobile = 2,
  siteDesktop = 3,
  siteOther = 4,
  other = 5
}

const sspsData: Array<{ value: SSPs; label: string }> = [
  { value: '', label: 'All SSPs' },
  { value: 'Eskimi', label: 'Eskimi' },
  { value: 'Epom', label: 'Epom' },
  { value: 'Qortex', label: 'Qortex' }
]

const placementsData: Array<{ value: string; label: string }> = [
  { value: RequestStatPlacement.app.toString(), label: 'App' },
  { value: RequestStatPlacement.siteMobile.toString(), label: 'Site - Mobile' },
  { value: RequestStatPlacement.siteDesktop.toString(), label: 'Site - Desktop' },
  { value: RequestStatPlacement.other.toString(), label: 'Site - other' }
]

const SSPsAnalytics = () => {
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
      }
    | undefined
  >()

  const [ssp, setSsp] = useState<SSPs>('')
  const [placement, setPlacement] = useState<RequestStatPlacement>(RequestStatPlacement.app)
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
        placement
      })
      setAnalyticsKey(key)
      console.log('key', key)
    }

    checkAnalytics()
  }, [getAnalyticsKeyAndUpdate, placement, ssp])

  const loading = useMemo(() => analytics?.status === 'loading', [analytics])

  return (
    <Stack gap="xs">
      <Group align="start" justify="left" gap="xs">
        <Select
          label="SSP"
          value={ssp}
          onChange={(val) => setSsp(val as SSPs)}
          data={sspsData}
          size="md"
        />
        <Select
          label="Placement"
          value={placement.toString()}
          // @ts-ignore
          onChange={(val) => setPlacement(val as string)}
          data={placementsData}
          size="md"
        />
      </Group>

      <Stack>
        {loading && <Loader />}
        <Code>{JSON.stringify(analytics?.data, null, 2)}</Code>
      </Stack>
    </Stack>
  )
}

export default SSPsAnalytics
