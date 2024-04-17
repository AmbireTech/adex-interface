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
import { CampaignData, EventAggregatesDataRes, EvAggrData } from 'types/campaignsData'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'

const defaultCampaignData: CampaignData = {
  campaignId: '',
  campaign: { ...CREATE_CAMPAIGN_DEFAULT_VALUE },
  impressions: 0,
  clicks: 0,
  ctr: 'N/A',
  avgCpm: 'N/A',
  paid: 0
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

const campaignResToCampaignData = (
  cmpRes: Campaign,
  advData: EvAggrData,
  prevCmp?: CampaignData
): CampaignData => {
  const adv: {
    impressions: number
    clicks: number
    ctr: number | string
    avgCpm: number | string
    paid: number
  } = {
    ...(advData || {
      clicks: 0,
      impressions: 0
    }),
    ...{
      // TODO: Decimals to umber fn
      paid: Number(advData?.payouts || 0) * 10 ** -8,
      ctr: 'N/A',
      avgCpm: 'N/A'
    }
  }

  if (adv.impressions > 0) {
    adv.ctr = (adv.clicks / adv.impressions) * 100
    adv.avgCpm = (adv.paid / adv.impressions) * 1000
  }

  const currentCMP = {
    ...(prevCmp || defaultCampaignData),
    campaignId: cmpRes.id,
    campaign: { ...defaultCampaignData.campaign, ...cmpRes },
    ...adv
  }

  return currentCMP
}

interface ICampaignsDataContext {
  campaignsData: Map<string, CampaignData>
  // TODO: all campaigns event aggregations by account
  // eventAggregates: Map<Campaign['id'], EvAggrData>
  updateCampaignDataById: (params: Campaign['id']) => void
  updateAllCampaignsData: (updateAdvanced?: boolean) => void
  // updateEventAggregates: (params: Campaign['id']) => void
  initialDataLoading: boolean
}

const CampaignsDataContext = createContext<ICampaignsDataContext | null>(null)

const CampaignsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  const { authenticated } = useAccount()
  const [initialDataLoading, setInitialDataLoading] = useState(true)

  const [campaignsData, setCampaignData] = useState<ICampaignsDataContext['campaignsData']>(
    new Map<Campaign['id'], CampaignData>()
  )

  const getCampaignAdvancedData = useCallback(
    async (campaignId: string): Promise<EvAggrData> => {
      try {
        // TODO: this data can be get from the backend if implemented to return this by id or by owner
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

        const advData = await getCampaignAdvancedData(campaignId)

        setCampaignData((prev) => {
          const updatedCmp = campaignResToCampaignData(
            campaignDetailsRes,
            advData,
            prev.get(campaignId)
          )
          const next = new Map(prev)
          next.set(campaignId, updatedCmp)
          return next
        })
      } catch (err) {
        console.log(err)
        showNotification('error', `getting campaign with id ${campaignId}`, 'Data error')
      }
    },
    [adexServicesRequest, getCampaignAdvancedData, showNotification]
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
              const currentCMP = campaignResToCampaignData(cmp, advData[index], prev.get(cmp.id))
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

  useEffect(() => {
    if (authenticated) {
      const updateCampaigns = async () => {
        await updateAllCampaignsData(true)
        setInitialDataLoading(false)
      }

      updateCampaigns()
    } else {
      setCampaignData(new Map<string, CampaignData>())
      setInitialDataLoading(false)
    }
  }, [updateAllCampaignsData, authenticated])

  const contextValue = useMemo(
    () => ({
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      initialDataLoading
    }),
    [campaignsData, updateCampaignDataById, updateAllCampaignsData, initialDataLoading]
  )

  return (
    <CampaignsDataContext.Provider value={contextValue}>{children}</CampaignsDataContext.Provider>
  )
}

export { CampaignsDataContext, CampaignsDataProvider }
