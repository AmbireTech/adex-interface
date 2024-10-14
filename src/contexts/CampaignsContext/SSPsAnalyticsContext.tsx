import { IabTaxonomyV3 } from 'adex-common'
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

import { getEpoch, MINUTE } from 'helpers'

const IabCategories = Object.values(IabTaxonomyV3)

type DataStatus = 'loading' | 'updating' | 'processed' | 'error'

enum RequestStatPlacement {
  app = 1,
  siteMobile = 2,
  siteDesktop = 3,
  siteOther = 4,
  other = 5
}

export type SSPsAnalyticsData = {
  value: string | number
  count: number
}

// "limit": number,
// "date": string (date string in format YYYY-MM-DD, defaults to today),
// "category": string[],
// "country": string[],
// "placement": number (valid options: enum RequestStatPlacement see below),
// "groupBy": string (valid options: bidfloor(default), country, category, placement)

export type SSPsAnalyticsDataKeys = {
  limit?: number
  date?: string
  category?: typeof IabCategories
  publisher?: string
  placement?: RequestStatPlacement
  country?: string
}

const defaultRefreshQuery = 1 * MINUTE

function getRefreshKey(timestamp: number): number {
  return getEpoch(timestamp, defaultRefreshQuery)
}

const getAnalyticsKeyFromQuery = (queryParams: SSPsAnalyticsDataKeys): string => {
  // TODO: hex or hash
  const mapKey = Object.keys(queryParams)
    .sort()
    .reduce((result: string, key: string) => {
      if (queryParams[key as keyof SSPsAnalyticsDataKeys] !== undefined) {
        const val = queryParams[key as keyof SSPsAnalyticsDataKeys]
        return `${result}_${val instanceof Date ? getRefreshKey(val.getTime()) : val?.toString()}`
      }

      return result
    }, '')
    .toString()
  return mapKey
}

interface ISSPsAnalyticsContext {
  analyticsData: Map<string, { status: DataStatus; data: SSPsAnalyticsData[] }>
  getAnalyticsKeyAndUpdate: (filter: SSPsAnalyticsDataKeys) => Promise<{ key: string } | undefined>
  initialAnalyticsLoading: boolean
}

const SSPsAnalyticsContext = createContext<ISSPsAnalyticsContext | null>(null)

const SSPsAnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  const { authenticated } = useAccount()
  const [initialAnalyticsLoading, setInitialAnalyticsLoading] = useState(true)

  const [analyticsData, setAnalyticsData] = useState<ISSPsAnalyticsContext['analyticsData']>(
    new Map<string, { status: DataStatus; data: SSPsAnalyticsData[] }>()
  )

  const updateCampaignAnalyticsByQuery = useCallback(
    async (params: SSPsAnalyticsDataKeys, dataKey: string) => {
      try {
        const analyticsDataRes = await adexServicesRequest<SSPsAnalyticsData[]>('backend', {
          route: '/dsp/stats/advanced',
          method: 'POST',
          body: params
        })

        console.log({ analyticsDataRes })

        if (!analyticsDataRes) {
          throw new Error('invalid analytics data response')
        }

        setAnalyticsData((prev) => {
          const next = new Map(prev)
          const nextAggr: { status: DataStatus; data: SSPsAnalyticsData[] } =
            { status: 'processed', data: analyticsDataRes } || prev.get(dataKey)
          next.set(dataKey, nextAggr)
          return next
        })
      } catch (err: any) {
        console.log(err)
        setAnalyticsData((prev) => {
          const next = new Map(prev)
          const nextAggr: { status: DataStatus; data: SSPsAnalyticsData[] } = {
            status: 'error',
            data: prev.get(dataKey)?.data || []
          }
          next.set(dataKey, nextAggr)
          return next
        })
        showNotification('error', err?.message || err.toString(), 'Fetching AdEx DSP analytics')
      }

      return dataKey
    },
    [adexServicesRequest, showNotification]
  )

  const getAnalyticsKeyAndUpdate = useCallback(
    async (filter: SSPsAnalyticsDataKeys): Promise<{ key: string } | undefined> => {
      const key = getAnalyticsKeyFromQuery(filter)

      updateCampaignAnalyticsByQuery(filter, key)

      return { key }
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
      setAnalyticsData(new Map<string, { status: DataStatus; data: SSPsAnalyticsData[] }>())
      setInitialAnalyticsLoading(false)
    }
  }, [authenticated])

  const contextValue = useMemo(
    () => ({
      analyticsData,
      getAnalyticsKeyAndUpdate,
      initialAnalyticsLoading
    }),
    [analyticsData, getAnalyticsKeyAndUpdate, initialAnalyticsLoading]
  )

  return (
    <SSPsAnalyticsContext.Provider value={contextValue}>{children}</SSPsAnalyticsContext.Provider>
  )
}

export { SSPsAnalyticsContext, SSPsAnalyticsProvider }
