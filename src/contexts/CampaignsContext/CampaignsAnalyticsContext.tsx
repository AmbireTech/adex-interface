import { Campaign } from 'adex-common'
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

const keySeparator = '👩🏼'

type DataStatus = 'loading' | 'updating' | 'processed'

type QueryStatusAndType = {
  dataStatus: DataStatus
  analyticsType: AnalyticsType
}

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

interface ICampaignsAnalyticsContext {
  analyticsData: Map<string, AnalyticsData[]>
  // TODO: all campaigns event aggregations by account
  getAnalyticsKeyAndUpdate: (
    analyticsType: AnalyticsType,
    campaign?: Campaign,
    forAdmin?: boolean,
    timeframe?: Timeframe,
    startFrom?: Date,
    endTo?: Date,
    ssp?: SSPs
  ) => Promise<{ key: string; period: AnalyticsPeriod } | undefined>
  initialAnalyticsLoading: boolean
  mappedAnalytics: Map<string, BaseAnalyticsData[]>
}

const CampaignsAnalyticsContext = createContext<ICampaignsAnalyticsContext | null>(null)

const CampaignsAnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  const { authenticated } = useAccount()
  const [initialAnalyticsLoading, setInitialAnalyticsLoading] = useState(true)
  const [mappedAnalytics, setMappedAnalytics] = useState<
    ICampaignsAnalyticsContext['mappedAnalytics']
  >(new Map<string, BaseAnalyticsData[]>())
  const [dataToMapStatus, setDataToMapStatus] = useState<Map<string, QueryStatusAndType>>(
    new Map<string, QueryStatusAndType>()
  )

  const [analyticsData, setAnalyticsData] = useState<ICampaignsAnalyticsContext['analyticsData']>(
    new Map<string, AnalyticsData[]>()
  )

  const updateAnalytics = useCallback(
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

        // if (!analyticsDataRes?.aggr) {
        //   throw new Error('invalid analytics data response')
        // }

        setAnalyticsData((prev) => {
          const next = new Map(prev)
          const nextAggr = analyticsDataRes?.aggr || prev.get(dataKey) || []
          next.set(dataKey, nextAggr)
          return next
        })
      } catch (err) {
        console.log(err)
        // TODO: see how to use campaignId out of segment
        showNotification('error', `getting analytics ${params.timeframe}`, 'Data error')
      }

      return dataKey
    },
    [adexServicesRequest, showNotification]
  )

  const updateCampaignAnalyticsByQuery = useCallback(
    (query: AnalyticsDataQuery, dataKey: string, forAdmin?: boolean): void => {
      updateAnalytics(query, dataKey, forAdmin)
    },
    [updateAnalytics]
  )

  const getAnalyticsKeyAndUpdate = useCallback(
    async (
      analyticsType: AnalyticsType,
      campaign?: Campaign,
      forAdmin?: boolean,
      selectedTimeframe?: Timeframe,
      startFrom?: Date,
      endTo?: Date,
      ssp?: SSPs
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
        ...(!forAdmin && { campaignId: campaign?.id }),
        ...period,
        metric: 'paid',
        eventType: 'CLICK',
        limit: 100000,
        timezone: 'UTC',
        timeframe,
        ...{ ssp },
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

      const keys: string[] = queries.map((q) => getAnalyticsKeyFromQuery(q))
      const dataStatusKey = keys.join(keySeparator)

      if (!dataToMapStatus.get(dataStatusKey)) {
        // NOTE: use in case to call the queries in some intervals
        // eslint-disable-next-line no-restricted-syntax
        for (const [i, q] of queries.entries()) {
          updateCampaignAnalyticsByQuery(q, keys[i], forAdmin)
          if (i < queries.length) {
            // eslint-disable-next-line no-await-in-loop
            await timeout(69)
          }
        }

        setDataToMapStatus((prev) => {
          const next = new Map(prev)
          next.set(dataStatusKey, { dataStatus: 'loading', analyticsType })
          return next
        })
      }

      return { key: dataStatusKey, period }
    },
    [dataToMapStatus, updateCampaignAnalyticsByQuery]
  )

  useEffect(() => {
    if (authenticated) {
      const updateCampaigns = async () => {
        setInitialAnalyticsLoading(false)
      }

      updateCampaigns()
    } else {
      setAnalyticsData(new Map<string, AnalyticsData[]>())
      setInitialAnalyticsLoading(false)
    }
  }, [authenticated])

  useEffect(() => {
    setDataToMapStatus((prev) => {
      let update = false
      const nextMappedData = new Map<string, BaseAnalyticsData[]>()
      const nextMapStatuses = new Map(prev)

      prev.forEach((status, statusKey) => {
        const analyticsKeys = statusKey.split(keySeparator)

        if (status.dataStatus === 'loading') {
          const isLoaded = analyticsKeys.every((aKey) => !!analyticsData.get(aKey))
          if (isLoaded) {
            const analyticsDataAggregates = analyticsKeys.map(
              (key) => analyticsData.get(key) as unknown as AnalyticsData[]
            )

            const mapped = analyticsDataToMappedAnalytics(
              analyticsDataAggregates,
              status.analyticsType
            )

            if (mapped) {
              // TODO: map data
              nextMappedData.set(statusKey, mapped)

              nextMapStatuses.set(statusKey, { ...status, dataStatus: 'processed' })
              update = true
            }
          }
        }
      })

      if (update) {
        // TODO: process data - map to dev friendly format
        setMappedAnalytics((prevMapped) => {
          const nextMapped = new Map(prevMapped)
          nextMappedData.forEach((value, key) => {
            nextMapped.set(key, value)
          })

          return nextMapped
        })

        return new Map(nextMapStatuses)
      }

      return prev
    })
  }, [analyticsData, dataToMapStatus])

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
