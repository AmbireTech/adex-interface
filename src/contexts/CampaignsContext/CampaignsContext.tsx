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
import useCustomNotifications from 'hooks/useCustomNotifications'

// NOTE: Will put here all the campaigns data and analytics for ease of use
// Laater we can separate the analytics in different context

type CampaignData = {
  campaignId: string
  campaign: Campaign
  impressions: Number
  clicks: Number
  // clicks / impressions * 100
  crt: Number
  // payed / impressions * 1000
  avgCpm: Number
  payed: Number
  // TODO: analyticsData type
  analyticsData: any
}

const defaultcampaignData = {
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
  // TODO: all campaigns event aggregations by account
  eventAggregates: any
  updateCampaignDataById: (params: string, updateAnalytics: boolean) => void
  updateAllCampaignsData: () => void
}

const CampaignsDataContext = createContext<ICampaignsDataContext | null>(null)

const CampaignsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()
  // eslint-disable-next-line
  const [campaignsData, setCampaignData] = useState<Map<string, CampaignData>>(
    new Map<string, CampaignData>()
  )

  // eslint-disable-next-line
  const [eventAggregates, setEventAggregates] = useState<any>({})

  const updateCampaignDataById = useCallback(
    async (campaignId: string, updateAnalytics: boolean = true) => {
      console.log({ campaignId })
      console.log({ updateAnalytics })
      try {
        const campaignDetailsRes = await adexServicesRequest<Campaign>('backend', {
          route: `/dsp/campaigns/by-id/${campaignId}`,
          method: 'GET'
        })

        setCampaignData((prev) => {
          const updatedCmp = prev.get(campaignId) || {
            ...defaultcampaignData,
            campaignId,
            campaign: campaignDetailsRes
          }

          if (campaignId === campaignDetailsRes?.id) {
            updatedCmp.campaign = campaignDetailsRes
            return new Map(prev.set(campaignId, updatedCmp))
          }
          showNotification('warning', `campaign with id ${campaignId} not found`, 'Data warning')

          // NOTE: skip state update
          return prev
        })
      } catch (err) {
        console.log(err)
        showNotification('error', `getting campaign with id ${campaignId}`, 'Data error')
      }
    },
    [adexServicesRequest, showNotification]
  )

  const updateAllCampaignsData = useCallback(async () => {
    try {
      const dataRes = await adexServicesRequest<Array<Campaign>>('backend', {
        route: '/dsp/campaigns/by-owner',
        method: 'GET'
      })

      console.log({ dataRes })
      if (Array.isArray(dataRes)) {
        setCampaignData((prev) => {
          const next = new Map(prev)
          dataRes.forEach((cmp: Campaign) => {
            const currentCMP = {
              ...(prev.get(cmp.id) || {
                ...defaultcampaignData,
                campaignId: cmp.id,
                campaign: cmp
              })
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
  }, [adexServicesRequest, showNotification])

  const updateEventAggregates = useCallback(() => {
    // TODO
  }, [])

  useEffect(() => {
    updateAllCampaignsData()
    updateEventAggregates()
  }, [updateAllCampaignsData, updateEventAggregates])

  const contextValue = useMemo(
    () => ({
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      eventAggregates
    }),
    [campaignsData, updateCampaignDataById, updateAllCampaignsData, eventAggregates]
  )

  return (
    <CampaignsDataContext.Provider value={contextValue}>{children}</CampaignsDataContext.Provider>
  )
}

export { CampaignsDataContext, CampaignsDataProvider }
