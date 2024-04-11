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
import { AnalyticsDataQuery, AnalyticsData, AnalyticsDataRes } from 'types/campaignsData'

const keySeparator = '👩🏼‍🏫'

type AnalyticsType = 'timeframe' | 'hostname' | 'country'
type DataStatus = 'loading' | 'processed'

const getAnalyticsKeyFromQuery = (queryParams: AnalyticsDataQuery): string => {
  // TODO: hex or hash
  const mapKey = Object.keys(queryParams)
    .sort()
    .reduce((result: string, key: string) => {
      if (queryParams[key as keyof AnalyticsDataQuery] !== undefined) {
        return `${result}_${queryParams[key as keyof AnalyticsDataQuery]?.toString()}`
      }

      return result
    }, '')
  return mapKey
}

interface ICampaignsAnalyticsContext {
  // analyticsData: AnalyticsData[]
  analyticsData: Map<string, AnalyticsData[]>
  // TODO: all campaigns event aggregations by account
  updateCampaignAnalyticsByQuery: (queryParams: AnalyticsDataQuery) => string
  getAnalyticsKeyFromQuery: (queryParams: AnalyticsDataQuery) => string
  getAnalyticsKeyAndUpdate: (campaign: Campaign, analyticsType: AnalyticsType) => string
  initialAnalyticsLoading: boolean
  mappedAnalytics: Map<string, any>
}

const CampaignsAnalyticsContext = createContext<ICampaignsAnalyticsContext | null>(null)

const CampaignsAnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  const { authenticated } = useAccount()
  const [initialAnalyticsLoading, setInitialAnalyticsLoading] = useState(true)
  const [mappedAnalytics, setMappedAnalytics] = useState<
    ICampaignsAnalyticsContext['mappedAnalytics']
  >(new Map<string, any>())
  const [dataToMapStatus, setDataToMapStatus] = useState<Map<string, DataStatus>>(
    new Map<string, DataStatus>()
  )

  const [analyticsData, setAnalyticsData] = useState<ICampaignsAnalyticsContext['analyticsData']>(
    new Map<string, AnalyticsData[]>()
  )

  const updateAnalytics = useCallback(
    async (params: AnalyticsDataQuery, dataKey: string) => {
      try {
        const analyticsDataRes = await adexServicesRequest<AnalyticsDataRes>('validator', {
          route: '/v5_a/analytics/for-advertiser',
          method: 'GET',
          queryParams: Object.entries(params).reduce(
            (query: Record<string, string>, [key, value]) => {
              const updated = { ...query }
              updated[key] = value.toString()
              return updated
            },
            {}
          )
        })

        console.log({ analyticsDataRes })

        // if (!analyticsDataRes.aggr?.length) {
        //   // TODO do something
        //   return
        // }
        setAnalyticsData((prev) => {
          console.log({ dataKey })
          console.log({ prev })
          const next = new Map(prev)
          next.set(dataKey, analyticsDataRes.aggr)
          console.log({ next })
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
    (query: AnalyticsDataQuery): string => {
      // const campaign = campaignsData.get(campaignId)?.campaign

      // if (!campaign) {
      //   return ''
      // }

      // TODO: update analytics another way, because having campaignsData here can trigger infinite loop

      const dataKey = getAnalyticsKeyFromQuery(query)

      updateAnalytics(query, dataKey)
      return dataKey
    },
    [updateAnalytics]
  )

  const getAnalyticsKeyAndUpdate = useCallback(
    (campaign: Campaign, analyticsType: AnalyticsType): string => {
      console.log({ campaign })

      if (!campaign.id || !analyticsType) {
        return ''
      }

      const baseQuery: AnalyticsDataQuery = {
        campaignId: campaign.id,
        start: new Date(Number(campaign.activeFrom)),
        end: new Date(Date.now()),
        metric: 'paid',
        eventType: 'CLICK',
        limit: 10000000,
        timezone: 'UTC',
        timeframe: 'week',
        segmentBy: analyticsType === 'timeframe' ? 'campaignId' : analyticsType
      }

      const queries: AnalyticsDataQuery[] = [
        { ...baseQuery, eventType: 'IMPRESSION', metric: 'count' },
        { ...baseQuery, eventType: 'IMPRESSION', metric: 'paid' },
        { ...baseQuery, eventType: 'CLICK', metric: 'count' },
        { ...baseQuery, eventType: 'CLICK', metric: 'paid' }
      ]

      const keys: string[] = []

      queries.forEach((q) => {
        const k = updateCampaignAnalyticsByQuery(q)
        keys.push(k)
      })

      const key = keys.join(keySeparator)

      setDataToMapStatus((prev) => {
        const next = new Map(prev)
        next.set(key, 'loading')
        return next
      })

      return key
    },
    [updateCampaignAnalyticsByQuery]
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

      prev.forEach((statusKey, status) => {
        const analyticsKeys = statusKey.split(keySeparator)

        if (status === 'loading') {
          const isLoaded = analyticsKeys.every((aKey) => !!analyticsData.get(aKey))
          if (isLoaded) {
            prev.set(statusKey, 'processed')
            update = true

            // TODO: process data - map to dev friendly format
            setMappedAnalytics((prevMapped) => {
              const nextMapped = new Map(prevMapped)

              return nextMapped
            })
          }
        }
      })

      if (update) {
        return new Map(prev)
      }
      return prev
    })
  }, [analyticsData, dataToMapStatus])

  const contextValue = useMemo(
    () => ({
      updateCampaignAnalyticsByQuery,
      analyticsData,
      getAnalyticsKeyFromQuery,
      getAnalyticsKeyAndUpdate,
      initialAnalyticsLoading,
      mappedAnalytics
    }),
    [
      updateCampaignAnalyticsByQuery,
      analyticsData,
      getAnalyticsKeyAndUpdate,
      initialAnalyticsLoading,
      mappedAnalytics
    ]
  )

  return (
    <CampaignsAnalyticsContext.Provider value={contextValue}>
      {children}
    </CampaignsAnalyticsContext.Provider>
  )
}

export { CampaignsAnalyticsContext, CampaignsAnalyticsProvider }
