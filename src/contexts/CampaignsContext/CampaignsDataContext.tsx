import { Campaign, CampaignStatus } from 'adex-common'
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
  BaseData,
  CampaignData,
  //  EventAggregatesDataRes,
  EvAggrData
} from 'types/campaignsData'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

const defaultCampaignData: CampaignData = {
  campaignId: '',
  campaign: { ...CREATE_CAMPAIGN_DEFAULT_VALUE },
  impressions: 0,
  clicks: 0,
  ctr: 0,
  avgCpm: 0,
  paid: 0
}

type CamapignBackendDataRes = Campaign & {
  totalSpent: number
  impressions?: number
  verifiedImpressions?: number
  clicks?: number
}

// const eventAggregatestResToAdvData = (dataRes: EventAggregatesDataRes): EvAggrData => {
//   const newData: EvAggrData = {
//     clicks: dataRes.events[0].totals.CLICK.eventCounts,
//     impressions: dataRes.events[0].totals.IMPRESSION.eventCounts,
//     payouts: Number(
//       BigInt(dataRes.events[0].totals.CLICK.eventPayouts) +
//         BigInt(dataRes.events[0].totals.IMPRESSION.eventPayouts)
//     )
//   }

//   return newData
// }

const campaignDataResToAdvData = (dataRes: CamapignBackendDataRes): EvAggrData => {
  const newData: EvAggrData = {
    clicks: dataRes.clicks || 0,
    impressions: dataRes.impressions || 0,
    payouts: dataRes.totalSpent
  }

  return newData
}

const campaignResToCampaignData = (
  cmpRes: Campaign,
  advData?: EvAggrData,
  prevCmp?: CampaignData
): CampaignData => {
  const adv: BaseData = {
    ...(advData || {
      clicks: 0,
      impressions: 0
    }),
    ...{
      paid: Number(
        parseBigNumTokenAmountToDecimal(
          BigInt(advData?.payouts || 0n),
          cmpRes.outpaceAssetDecimals
        ).toFixed(2)
      ),
      ctr: 0,
      avgCpm: 0
    }
  }

  if (adv.impressions > 0) {
    adv.ctr = Number(((adv.clicks / adv.impressions) * 100).toFixed(4))
    adv.avgCpm = Number(((adv.paid / adv.impressions) * 1000).toFixed(2))
  }

  const currentCMP = {
    ...(prevCmp || defaultCampaignData),
    campaignId: cmpRes.id,
    campaign: { ...defaultCampaignData.campaign, ...cmpRes },
    ...adv
  }

  return currentCMP
}

const getURLSubRouteByCampaignStatus = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.active:
      return 'resume'
    case CampaignStatus.closedByUser:
      return 'close'
    case CampaignStatus.paused:
      return 'pause'
    default:
      throw new Error('Invalid status')
  }
}
interface ICampaignsDataContext {
  campaignsData: Map<string, CampaignData>
  // TODO: all campaigns event aggregations by account
  // eventAggregates: Map<Campaign['id'], EvAggrData>
  updateCampaignDataById: (params: Campaign['id']) => void
  updateAllCampaignsData: (updateAdvanced?: boolean) => void
  // updateEventAggregates: (params: Campaign['id']) => void
  initialDataLoading: boolean
  changeCampaignStatus: (status: CampaignStatus, campaignId: Campaign['id']) => void
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

  // const getCampaignAdvancedData = useCallback(
  //   async (campaignId: string): Promise<EvAggrData> => {
  //     try {
  //       // TODO: this data can be get from the backend if implemented to return this by id or by owner
  //       const eventAggregatesRes = await adexServicesRequest<EventAggregatesDataRes>('validator', {
  //         route: `/v5_a/channel/${campaignId}/events-aggregates`,
  //         method: 'GET'
  //       })

  //       return eventAggregatestResToAdvData(eventAggregatesRes)
  //     } catch (err) {
  //       return {
  //         clicks: 0,
  //         impressions: 0,
  //         payouts: 0
  //       }
  //     }
  //   },
  //   [adexServicesRequest]
  // )

  const changeCampaignStatus = useCallback(
    async (status: CampaignStatus, campaignId: string) => {
      try {
        const campaignStatusRes = await adexServicesRequest<{ success: boolean }>('backend', {
          route: `/dsp/campaigns/${getURLSubRouteByCampaignStatus(status)}/${campaignId}`,
          method: 'POST'
        })

        if (!campaignStatusRes.success) {
          showNotification('error', `changing campaign status with id ${campaignId}`, 'Data error')
          return
        }

        setCampaignData((prev) => {
          const prevCampaignState = prev.get(campaignId)

          if (!prevCampaignState) return prev

          const updated = {
            ...prevCampaignState,
            campaign: { ...prevCampaignState?.campaign, status }
          }

          const next = new Map(prev)
          next.set(campaignId, updated)

          return next
        })
      } catch (err) {
        console.log(err)
        showNotification('error', `changing campaign status with id ${campaignId}`, 'Data error')
      }
    },
    [adexServicesRequest, showNotification]
  )

  const updateCampaignDataById = useCallback(
    async (campaignId: string) => {
      console.log({ campaignId })
      try {
        const campaignDetailsRes = await adexServicesRequest<CamapignBackendDataRes>('backend', {
          route: `/dsp/campaigns/by-id/${campaignId}`,
          method: 'GET'
        })

        if (campaignId !== campaignDetailsRes?.id) {
          // NOTE: skip state update
          showNotification('error', `getting campaign with id ${campaignId}`, 'Data error')
          return
        }

        // const advData = await getCampaignAdvancedData(campaignId)
        const advData = campaignDataResToAdvData(campaignDetailsRes)

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
    [adexServicesRequest, showNotification]
  )

  const updateAllCampaignsData = useCallback(
    async (updateAdvanced?: boolean) => {
      try {
        const dataRes = await adexServicesRequest<Array<CamapignBackendDataRes>>('backend', {
          route: '/dsp/campaigns/by-owner',
          method: 'GET'
        })

        console.log({ dataRes })

        let advData: EvAggrData[]

        // if (updateAdvanced) {
        //   const calls = [...dataRes].map(({ id }) => getCampaignAdvancedData(id))

        //   advData = await Promise.all(calls)
        //   console.log({ advData })
        // }

        if (updateAdvanced) {
          advData = [...dataRes].map((cmpDataRes) => campaignDataResToAdvData(cmpDataRes))
          console.log({ advData })
        }

        console.log({ dataRes })
        if (Array.isArray(dataRes)) {
          setCampaignData((prev) => {
            const next = new Map(prev)

            dataRes.forEach((cmp: Campaign, index: number) => {
              const currentCMP = campaignResToCampaignData(cmp, advData?.[index], prev.get(cmp.id))
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
    [adexServicesRequest, showNotification]
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
      initialDataLoading,
      changeCampaignStatus
    }),
    [
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      initialDataLoading,
      changeCampaignStatus
    ]
  )

  return (
    <CampaignsDataContext.Provider value={contextValue}>{children}</CampaignsDataContext.Provider>
  )
}

export { CampaignsDataContext, CampaignsDataProvider }
