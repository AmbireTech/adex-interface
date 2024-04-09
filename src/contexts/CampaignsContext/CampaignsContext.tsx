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
  CampaignData,
  AnalyticsDataQuery,
  AnalyticsData,
  AnalyticsDataRes,
  EventAggregatesDataRes,
  EvAggrData
} from 'types/campaignsData'

// NOTE: Will put here all the campaigns data and analytics for ease of use
// Later we can separate the analytics in different context

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

const eventAggregatestResToAdvData = (dataRes: EventAggregatesDataRes): EvAggrData => {
  const newData: EvAggrData = {
    clicks: dataRes.events[0].totals.CLICK.eventCounts,
    impressions: dataRes.events[0].totals.IMPRESSION.eventCounts,
    payouts:
      BigInt(dataRes.events[0].totals.CLICK.eventPayouts) +
      BigInt(dataRes.events[0].totals.IMPRESSION.eventPayouts)
  }

  return newData
}

const defaultCampaignData = {
  campaignId: '',
  campaign: {},
  impressions: 0,
  clicks: 0,
  crt: 0,
  avgCpm: 0,
  payed: 0,
  analyticsData: {}
}

interface ICampaignsDataContext {
  campaignsData: Map<string, CampaignData>
  // analyticsData: AnalyticsData[]
  analyticsData: Map<string, AnalyticsData[]>
  // TODO: all campaigns event aggregations by account
  eventAggregates: Map<Campaign['id'], EvAggrData>
  updateCampaignDataById: (params: Campaign['id']) => void
  updateAllCampaignsData: (updateAdvanced?: boolean) => void
  updateCampaignAnalyticsByQuery: (queryParams: AnalyticsDataQuery) => string
  updateEventAggregates: (params: Campaign['id']) => void
  getAnalyticsKeyFromQuery: (queryParams: AnalyticsDataQuery) => string
}

const CampaignsDataContext = createContext<ICampaignsDataContext | null>(null)

const CampaignsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  const { authenticated } = useAccount()

  const [campaignsData, setCampaignData] = useState<ICampaignsDataContext['campaignsData']>(
    new Map<Campaign['id'], CampaignData>()
  )

  const [analyticsData, setAnalyticsData] = useState<ICampaignsDataContext['analyticsData']>(
    new Map<string, AnalyticsData[]>()
  )

  // eslint-disable-next-line
  const [eventAggregates, setEventAggregates] = useState<ICampaignsDataContext['eventAggregates']>(
    new Map<Campaign['id'], EvAggrData>()
  )

  const updateCampaignDataById = useCallback(
    async (campaignId: string) => {
      console.log({ campaignId })
      try {
        const campaignDetailsRes = await adexServicesRequest<Campaign>('backend', {
          route: `/dsp/campaigns/by-id/${campaignId}`,
          method: 'GET'
        })

        if (campaignId !== campaignDetailsRes?.id) {
          // NOTE: skip state update
          showNotification('error', `getting campaign with id ${campaignId}`, 'Data error')
          return
        }

        setCampaignData((prev) => {
          const updatedCmp = {
            ...(prev.get(campaignId) || {
              ...defaultCampaignData,
              campaignId,
              campaign: campaignDetailsRes
            })
          }

          const next = new Map(prev)

          console.log({ next })
          next.set(campaignId, updatedCmp)

          return next
        })
      } catch (err) {
        console.log(err)
        showNotification('error', `getting campaign with id ${campaignId}`, 'Data error')
      }
    },
    [adexServicesRequest, showNotification]
  )

  // useEffect(() => {
  //   console.log({ adexServicesRequest })
  // }, [adexServicesRequest])

  // useEffect(() => {
  //   console.log({ showNotification })
  // }, [showNotification])

  const getCampaignAdvancedData = useCallback(
    async (campaignId: string): Promise<EvAggrData> => {
      try {
        const eventAggregatesRes = await adexServicesRequest<EventAggregatesDataRes>('validator', {
          route: `/v5_a/channel/${campaignId}/events-aggregates`,
          method: 'GET'
        })

        return eventAggregatestResToAdvData(eventAggregatesRes)
      } catch (err) {
        return {
          clicks: 0,
          impressions: 0,
          payouts: BigInt(0)
        }
      }
    },
    [adexServicesRequest]
  )

  const updateAllCampaignsData = useCallback(
    async (updateAdvanced?: boolean) => {
      try {
        const dataRes = await adexServicesRequest<Array<Campaign>>('backend', {
          route: '/dsp/campaigns/by-owner',
          method: 'GET'
        })

        let advData: EvAggrData[]

        if (updateAdvanced) {
          const calls = [...dataRes].map(({ id }) => getCampaignAdvancedData(id))

          advData = await Promise.all(calls)
        }

        console.log({ dataRes })
        if (Array.isArray(dataRes)) {
          setCampaignData((prev) => {
            const next = new Map(prev)
            dataRes.forEach((cmp: Campaign, index: number) => {
              const currentCMP = {
                ...(prev.get(cmp.id) || defaultCampaignData),
                campaignId: cmp.id,
                campaign: cmp,
                ...(advData && advData[index]
                  ? {
                      clicks: advData[index].clicks,
                      impressions: advData[index].impressions,
                      // TODO: payouts decimals calc
                      payed: Number(advData[index].payouts)
                    }
                  : {})
              }

              next.set(cmp.id, currentCMP)
            })

            return next
          })
        } else {
          showNotification('warning', 'invalid campaigns data response', 'Data error')
          console.log({ dataRes })
        }
      } catch (err) {
        console.log(err)
        showNotification('error', 'getting campaigns data', 'Data error')
      }
    },
    [adexServicesRequest, getCampaignAdvancedData, showNotification]
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

  const updateEventAggregates = useCallback(
    async (campaignId: Campaign['id']) => {
      try {
        // TODO: dataRes type
        const eventAggregatesRes = await adexServicesRequest<EventAggregatesDataRes>('validator', {
          route: `/v5_a/channel/${campaignId}/events-aggregates`,
          method: 'GET'
        })

        console.log({ eventAggregatesRes })

        if (!eventAggregatesRes?.events?.length) {
          // TODO do something
          return
        }

        setEventAggregates((prev) => {
          const newData: EvAggrData = {
            clicks: eventAggregatesRes.events[0].totals.CLICK.eventCounts,
            impressions: eventAggregatesRes.events[0].totals.IMPRESSION.eventCounts,
            payouts:
              BigInt(eventAggregatesRes.events[0].totals.CLICK.eventPayouts) +
              BigInt(eventAggregatesRes.events[0].totals.IMPRESSION.eventPayouts)
          }

          const next = new Map(prev)
          next.set(campaignId, newData)

          return next
        })
      } catch (err) {
        console.log(err)
        // TODO: see how to use campaignId out of segment
        showNotification(
          'error',
          `getting event aggregates for campaign ${campaignId}`,
          'Data error'
        )
      }
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

  useEffect(() => {
    if (authenticated) {
      updateAllCampaignsData()
    } else {
      setCampaignData(new Map<string, CampaignData>())
      setAnalyticsData(new Map<string, AnalyticsData[]>())
      setEventAggregates(new Map<Campaign['id'], EvAggrData>())
    }
  }, [updateAllCampaignsData, authenticated])

  const contextValue = useMemo(
    () => ({
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      updateCampaignAnalyticsByQuery,
      eventAggregates,
      analyticsData,
      updateEventAggregates,
      getAnalyticsKeyFromQuery
    }),
    [
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      updateCampaignAnalyticsByQuery,
      eventAggregates,
      analyticsData,
      updateEventAggregates
    ]
  )

  return (
    <CampaignsDataContext.Provider value={contextValue}>{children}</CampaignsDataContext.Provider>
  )
}

export { CampaignsDataContext, CampaignsDataProvider }
