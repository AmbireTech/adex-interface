import { Campaign, Placement } from 'adex-common'
import {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useState,
  useCallback,
  useEffect
} from 'react'
import { useAdExApi } from 'hooks/useAdexServices'
import useAccount from 'hooks/useAccount'
import useCustomNotifications from 'hooks/useCustomNotifications'
import {
  AnalyticsDataQuery,
  AnalyticsData,
  AnalyticsDataRes,
  AnalyticsType,
  BaseAnalyticsData,
  AnalyticsPeriod,
  Timeframe,
  SSPs
} from 'types'
import {
  timeout,
  getEpoch,
  getPeriodInitialEpoch,
  getTimeframeMaxPeriod,
  MINUTE,
  MONTH,
  YEAR
} from 'helpers'

import { dashboardTableElements } from 'components/Dashboard/mockData'

type DataStatus = 'loading' | 'updating' | 'processed' | 'error'

const defaultRefreshQuery = 1 * MINUTE

function getRefreshKey(timestamp: number): number {
  return getEpoch(timestamp, defaultRefreshQuery)
}

const getAnalyticsKeyFromQuery = (queryParams: AnalyticsDataQuery): string => {
  // TODO: hex or hash
  const mapKey = Object.keys(queryParams)
    .sort()
    .reduce((result: string, key: string) => {
      if (queryParams[key as keyof AnalyticsDataQuery] !== undefined) {
        const val = queryParams[key as keyof AnalyticsDataQuery]
        return `${result}_${val instanceof Date ? getRefreshKey(val.getTime()) : val?.toString()}`
      }

      return result
    }, '')
    .toString()
  return mapKey
}

const analyticsDataToMappedAnalytics = (
  analyticsData: AnalyticsData[][],
  analyticsType: AnalyticsType
): BaseAnalyticsData[] | undefined => {
  const impCounts = analyticsData[0]
  const impPaid = analyticsData[1]
  const clickCounts = analyticsData[2]
  // const clickPaid = analyticsData[3]

  // On development env using mock data
  if (process.env.NODE_ENV === 'development' && !analyticsData.length) {
    const mockedData = dashboardTableElements[0][analyticsType].map((x) => ({
      ...x,
      ctr: Number(((x.clicks / x.impressions) * 100).toFixed(4)),
      avgCpm: Number(((x.paid / x.impressions) * 1000).toFixed(2))
    }))

    return [...mockedData]
  }

  const mapped = impCounts.reduce((aggr, impElement) => {
    const next = new Map(aggr)

    const segmentField: keyof Omit<AnalyticsData, 'value'> =
      analyticsType === 'timeframe' ? 'time' : 'segment'

    const segmentKey: string = impElement?.[segmentField]?.toString() || '🦄'

    const nexSegment: BaseAnalyticsData = aggr.get(segmentKey) || {
      segment: segmentKey,
      clicks: 0,
      impressions: 0,
      paid: 0,
      analyticsType,
      ctr: 0,
      avgCpm: 0
    }

    nexSegment.impressions += Number(impElement.value)
    nexSegment.clicks += Number(
      clickCounts.find(
        (x) => x.time === impElement.time && x[segmentField] === impElement[segmentField]
      )?.value || 0
    )

    nexSegment.paid += Number(
      impPaid.find(
        (x) => x.time === impElement.time && x[segmentField] === impElement[segmentField]
      )?.value || 0
    )
    //  + Number(clickPaid.find((x) => x[segmentField] === impElement[segmentField])?.value || 0)

    return next.set(segmentKey, nexSegment)
  }, new Map<string, BaseAnalyticsData>())

  const resMap = Array.from(mapped, ([segment, value]) => {
    const { paid, clicks, impressions } = value

    return {
      ...value,
      segment,
      analyticsType,
      ctr: clicks && impressions ? Number(((clicks / impressions) * 100).toFixed(2)) : 0,
      avgCpm: paid && impressions ? Number(((paid / impressions) * 1000).toFixed(2)) : 0,
      avgCpc: clicks ? Number((paid / clicks).toFixed(4)) : 0
    }
  })
    // TODO: remove the sort when table sorting
    .sort((a, b) =>
      analyticsType === 'timeframe'
        ? Number(a.segment) - Number(b.segment)
        : b.impressions - a.impressions
    )

  console.log({ resMap })

  return resMap
}

type MappedAnalyticsRecord = {
  status: DataStatus
  analyticsType: AnalyticsType
  aggrKeys: string[]
  data: BaseAnalyticsData[]
}

interface ICampaignsAnalyticsContext {
  analyticsData: Map<string, { status: DataStatus; data: AnalyticsData[] }>
  // TODO: all campaigns event aggregations by account
  getAnalyticsKeyAndUpdate: (
    analyticsType: AnalyticsType,
    campaign?: Campaign,
    forAdmin?: boolean,
    timeframe?: Timeframe,
    startFrom?: Date,
    endTo?: Date,
    ssp?: SSPs,
    placement?: Placement
  ) => Promise<{ key: string; period: AnalyticsPeriod } | undefined>
  initialAnalyticsLoading: boolean
  mappedAnalytics: Map<string, MappedAnalyticsRecord>
}

const CampaignsAnalyticsContext = createContext<ICampaignsAnalyticsContext | null>(null)

const CampaignsAnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  const { authenticated } = useAccount()
  const [initialAnalyticsLoading, setInitialAnalyticsLoading] = useState(true)
  const [mappedAnalytics, setMappedAnalytics] = useState<
    ICampaignsAnalyticsContext['mappedAnalytics']
  >(new Map<string, MappedAnalyticsRecord>())

  const [analyticsData, setAnalyticsData] = useState<ICampaignsAnalyticsContext['analyticsData']>(
    new Map<string, { status: DataStatus; data: AnalyticsData[] }>()
  )

  const updateCampaignAnalyticsByQuery = useCallback(
    async (params: AnalyticsDataQuery, dataKey: string, forAdmin?: boolean) => {
      try {
        const analyticsDataRes = await adexServicesRequest<AnalyticsDataRes>('validator', {
          route: `/v5_a/analytics/${forAdmin ? 'for-admin' : 'for-dsp-users'}`,
          method: 'GET',
          queryParams: Object.entries(params).reduce(
            (query: Record<string, string>, [key, value]) => {
              const updated = { ...query }
              if (value !== undefined) {
                updated[key] = value.toString()
              }
              return updated
            },
            {}
          )
        })

        console.log({ analyticsDataRes })

        if (!analyticsDataRes?.aggr) {
          throw new Error('invalid analytics data response')
        }

        setAnalyticsData((prev) => {
          const next = new Map(prev)
          const nextAggr: { status: DataStatus; data: AnalyticsData[] } = {
            status: 'processed',
            data: analyticsDataRes?.aggr || prev.get(dataKey)?.data
          }
          next.set(dataKey, nextAggr)
          return next
        })
      } catch (err: any) {
        console.log(err)
        // TODO: see how to use campaignId out of segment
        setAnalyticsData((prev) => {
          const next = new Map(prev)
          const nextAggr: { status: DataStatus; data: AnalyticsData[] } = {
            status: 'error',
            data: prev.get(dataKey)?.data || []
          }
          next.set(dataKey, nextAggr)
          return next
        })
        showNotification(
          'error',
          err?.message || err.toString(),
          `Fetching analytics${forAdmin ? ' (admin)' : ''}`
        )
      }

      return dataKey
    },
    [adexServicesRequest, showNotification]
  )

  const getAnalyticsKeyAndUpdate = useCallback(
    async (
      analyticsType: AnalyticsType,
      campaign?: Campaign,
      forAdmin?: boolean,
      selectedTimeframe?: Timeframe,
      startFrom?: Date,
      endTo?: Date,
      ssp?: SSPs,
      placement?: Placement
    ): Promise<{ key: string; period: AnalyticsPeriod } | undefined> => {
      if (!analyticsType || (!forAdmin && !campaign?.id)) {
        return
      }

      // TODO: start fro UTC date 00:00
      const maxPeriod = getTimeframeMaxPeriod(selectedTimeframe || 'year')
      const start =
        startFrom ||
        (campaign
          ? new Date(getPeriodInitialEpoch(Number(campaign.activeFrom)) - 1)
          : new Date(Date.now() - maxPeriod))

      const period = {
        start,
        end:
          endTo ||
          (campaign
            ? new Date(Math.min(Date.now(), Number(campaign.activeTo)))
            : new Date(start.getTime() + maxPeriod))
      }

      let timeframe: AnalyticsDataQuery['timeframe'] = selectedTimeframe || 'year'
      if (campaign) {
        const periodDiff = (period?.end?.getTime() || 0) - (period?.start?.getTime() || 0)

        const isTimeframe = analyticsType === 'timeframe'

        if (isTimeframe && periodDiff >= YEAR) {
          timeframe = 'month'
        } else if (isTimeframe && periodDiff > MONTH) {
          timeframe = 'week'
        } else if (isTimeframe) {
          timeframe = 'day'
        }
      }

      // TODO: alg to set the timeframe depending on campaign start/end and current date
      const baseQuery: AnalyticsDataQuery = {
        ...(!!campaign && { campaignId: campaign?.id }),
        ...period,
        metric: 'paid',
        eventType: 'CLICK',
        limit: 100000,
        timezone: 'UTC',
        timeframe,
        ...{ ssp },
        ...{ placement },
        segmentBy: analyticsType === 'timeframe' ? undefined : analyticsType
      }

      // NOTE: do not get click paid until we have this king of payment models
      // TODO: bring back payments by click if enabled
      const queries: AnalyticsDataQuery[] = [
        { ...baseQuery, eventType: 'IMPRESSION', metric: 'count' },
        { ...baseQuery, eventType: 'IMPRESSION', metric: 'paid' },
        { ...baseQuery, eventType: 'CLICK', metric: 'count' }
        // { ...baseQuery, eventType: 'CLICK', metric: 'paid' }
      ]

      const aggrKeys: string[] = queries.map((q) => getAnalyticsKeyFromQuery(q))
      const mappedDataKey = getAnalyticsKeyFromQuery(baseQuery)

      if (!mappedAnalytics.get(mappedDataKey)) {
        setMappedAnalytics((prev) => {
          const next = new Map(prev)
          const nextMapped: MappedAnalyticsRecord = {
            status: 'loading',
            analyticsType,
            aggrKeys,
            data: []
          }
          next.set(mappedDataKey, nextMapped)
          console.log({ next })
          return next
        })
        // NOTE: use in case to call the queries in some intervals
        // eslint-disable-next-line no-restricted-syntax
        for (const [i, q] of queries.entries()) {
          const update = updateCampaignAnalyticsByQuery(q, aggrKeys[i], forAdmin)
          if (i < queries.length) {
            // eslint-disable-next-line no-await-in-loop
            await Promise.race([update, timeout(69)])
          }
        }
      }

      return { key: mappedDataKey, period }
    },
    [mappedAnalytics, updateCampaignAnalyticsByQuery]
  )

  useEffect(() => {
    if (authenticated) {
      const updateCampaigns = async () => {
        setInitialAnalyticsLoading(false)
      }

      updateCampaigns()
    } else {
      setAnalyticsData(new Map<string, { status: DataStatus; data: AnalyticsData[] }>())
      setInitialAnalyticsLoading(false)
    }
  }, [authenticated])

  useEffect(() => {
    setMappedAnalytics((prev) => {
      const nextMappedData = new Map(prev)

      prev.forEach(({ aggrKeys, analyticsType, data }, mappedDataKey) => {
        if (aggrKeys.every((aKey) => analyticsData.get(aKey)?.status === 'processed')) {
          const analyticsDataAggregates = aggrKeys.map((key) => analyticsData.get(key)!.data)

          const mapped = analyticsDataToMappedAnalytics(analyticsDataAggregates, analyticsType)

          if (mapped) {
            nextMappedData.set(mappedDataKey, {
              aggrKeys,
              analyticsType,
              status: 'processed',
              data: mapped
            })
          } else {
            nextMappedData.set(mappedDataKey, { data, aggrKeys, analyticsType, status: 'error' })
          }
        } else if (aggrKeys.some((aKey) => analyticsData.get(aKey)?.status === 'error')) {
          nextMappedData.set(mappedDataKey, { data, aggrKeys, analyticsType, status: 'error' })
        }
      })

      return nextMappedData
    })
  }, [analyticsData])

  const contextValue = useMemo(
    () => ({
      analyticsData,
      getAnalyticsKeyAndUpdate,
      initialAnalyticsLoading,
      mappedAnalytics
    }),
    [analyticsData, getAnalyticsKeyAndUpdate, initialAnalyticsLoading, mappedAnalytics]
  )

  return (
    <CampaignsAnalyticsContext.Provider value={contextValue}>
      {children}
    </CampaignsAnalyticsContext.Provider>
  )
}

export { CampaignsAnalyticsContext, CampaignsAnalyticsProvider }
