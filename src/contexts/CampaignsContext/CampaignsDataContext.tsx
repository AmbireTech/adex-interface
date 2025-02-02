import { Campaign, CampaignStatus } from 'adex-common'
import { createContext, FC, PropsWithChildren, useMemo, useState, useCallback } from 'react'
import { useAdExApi } from 'hooks/useAdexServices'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { BaseData, CampaignData, EvAggrData } from 'types'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'

type NotificationMsg = {
  title?: string
  msg?: string
}

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
  deleteDraftCampaign: (id: string) => void
  editCampaign: (
    campaignId: string,
    pricingBounds?: Partial<Campaign['pricingBounds']>,
    inputs?: Partial<Campaign['targetingInput']['inputs']>,
    successMsg?: NotificationMsg,
    errMsg?: NotificationMsg
  ) => Promise<{ success: boolean }>
  toggleArchived: (id: string) => void
  filterSources: (
    action: 'include' | 'exclude',
    campaignId: Campaign['id'],
    sources: { srcId: string; srcName: string }[]
  ) => Promise<void>
}

const CampaignsDataContext = createContext<ICampaignsDataContext | null>(null)

const CampaignsDataProvider: FC<PropsWithChildren & { type: 'user' | 'admin' }> = ({
  children,
  type
}) => {
  const { showNotification } = useCustomNotifications()
  const { adexServicesRequest } = useAdExApi()

  // const { authenticated } = useAccount()
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
          throw new Error(`changing campaign status with id ${campaignId}`)
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
      } catch (err: any) {
        console.log(err)
        showNotification('error', err?.message || err.toString(), 'Campaign status update error')
      }
    },
    [adexServicesRequest, showNotification]
  )

  const updateCampaignDataById = useCallback(
    async (campaignId: string) => {
      // console.log({ campaignId })
      try {
        const campaignDetailsRes = await adexServicesRequest<CamapignBackendDataRes>('backend', {
          route: `/dsp/campaigns/by-id/${campaignId}`,
          method: 'GET'
        })

        if (campaignId !== campaignDetailsRes?.id) {
          throw new Error(`Getting campaign with id ${campaignId}`)
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
      } catch (err: any) {
        console.log(err)
        showNotification('error', err?.message || err.toString(), 'Data error')
      }
    },
    [adexServicesRequest, showNotification]
  )

  const updateAllCampaignsData = useCallback(
    async (updateAdvanced?: boolean) => {
      try {
        const route = type === 'user' ? '/dsp/campaigns/by-owner' : '/dsp/admin/campaigns'
        const dataRes = await adexServicesRequest<Array<CamapignBackendDataRes>>('backend', {
          route,
          method: 'GET',
          queryParams: { all: 'true' }
        })

        let advData: EvAggrData[]

        // if (updateAdvanced) {
        //   const calls = [...dataRes].map(({ id }) => getCampaignAdvancedData(id))

        //   advData = await Promise.all(calls)
        //   console.log({ advData })
        // }

        if (updateAdvanced) {
          advData = [...dataRes].map((cmpDataRes) => campaignDataResToAdvData(cmpDataRes))
        }

        if (Array.isArray(dataRes)) {
          setCampaignData((prev) => {
            const next = new Map()

            const dataResIds = new Set(dataRes.map((cmp: Campaign) => cmp.id))

            dataRes.forEach((cmp: Campaign, index: number) => {
              const currentCMP = campaignResToCampaignData(cmp, advData?.[index], prev.get(cmp.id))
              next.set(cmp.id, currentCMP)
            })

            prev.forEach((_value, key) => {
              if (!dataResIds.has(key)) {
                next.delete(key)
              }
            })
            return next
          })
        } else {
          throw new Error('Invalid campaigns data response')
        }
      } catch (err: any) {
        console.log(err)
        showNotification('error', err?.message || err.toString(), 'Campaigns data error')
      } finally {
        setInitialDataLoading(false)
      }
    },
    [adexServicesRequest, showNotification, type]
  )

  // TODO: move to separate context delete and archive
  const deleteDraftCampaign = useCallback(
    async (id: string) => {
      try {
        await adexServicesRequest('backend', {
          route: `/dsp/campaigns/draft/${id}`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          onErrMsg: `Can not delete ${id}`
        })

        setCampaignData((prev) => {
          const next = new Map(prev)
          next.delete(id)

          return next
        })
      } catch (err) {
        console.log(err)
      }
    },
    [adexServicesRequest]
  )

  const toggleArchived = useCallback(
    async (id: string) => {
      await adexServicesRequest('backend', {
        route: `/dsp/campaigns/togglearchive/${id}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        onErrMsg: `Can not toggle archive ${id}`
      })
      updateCampaignDataById(id)
    },
    [adexServicesRequest, updateCampaignDataById]
  )

  const editCampaign = useCallback(
    async (
      campaignId: string,
      pricingBounds?: Partial<Campaign['pricingBounds']>,
      inputs?: Partial<Campaign['targetingInput']['inputs']>,
      successMsg?: NotificationMsg,
      errMsg?: NotificationMsg
    ) => {
      const campaign = campaignsData.get(campaignId)?.campaign

      if (!campaign) {
        throw new Error('invalid campaign')
      }

      const body: Pick<Campaign, 'pricingBounds' | 'targetingInput'> = {
        pricingBounds: { ...campaign.pricingBounds, ...pricingBounds },
        targetingInput: {
          ...campaign.targetingInput,
          inputs: {
            ...campaign.targetingInput.inputs,
            ...(inputs?.location && { location: inputs.location }),
            ...(inputs?.categories && {
              categories: inputs.categories
            }),
            ...(inputs?.ssp && { ssp: inputs.ssp }),
            ...(inputs?.publishers && {
              publishers: inputs.publishers
            }),
            // NOTE: uncomment if we decide that changing placements will be editable on the UI
            // ...(targetingInput?.inputs?.placements && { placements: targetingInput.inputs.placements}),
            ...(inputs?.advanced && { advanced: inputs.advanced })
          }
        }
      }

      try {
        const res = await adexServicesRequest<{ success?: boolean }>('backend', {
          route: `/dsp/campaigns/edit/${campaign.id}`,
          method: 'PUT',
          body,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!res?.success) {
          throw new Error('Error on updating campaign data')
        }

        showNotification(
          'info',
          successMsg?.msg || 'Successfully updated Campaign data!',
          successMsg?.title
        )
        updateCampaignDataById(campaign.id)
        return { success: true }
      } catch {
        showNotification(
          'error',
          errMsg?.msg || "Couldn't update the Campaign data!",
          errMsg?.title
        )
        return { success: false }
      }
    },
    [campaignsData, adexServicesRequest, showNotification, updateCampaignDataById]
  )

  const filterSources: ICampaignsDataContext['filterSources'] = useCallback(
    async (action, campaignId, sources): Promise<void> => {
      const campaign = campaignsData.get(campaignId)?.campaign
      if (!campaign) {
        throw new Error('invalid campaign ')
      }

      // console.log({ sources })
      const cleanNin = [...campaign.targetingInput.inputs.publishers.nin].filter(
        (x) => !sources.some((s) => s.srcId === x)
      )

      const blockedPublishers: Campaign['targetingInput']['inputs']['publishers'] = {
        ...campaign.targetingInput.inputs.publishers,
        apply: 'nin',
        nin: action === 'include' ? cleanNin : [...cleanNin, ...sources.map((x) => x.srcId)]
      }

      const inputs: Partial<Campaign['targetingInput']['inputs']> = {
        publishers: { ...blockedPublishers }
      }

      await editCampaign(campaignId, undefined, inputs, {
        title: action === 'exclude' ? 'Blocked' : 'Unblocked',
        msg: sources.length === 1 ? sources[0].srcName : `${sources.length} placements`
      })
    },
    [campaignsData, editCampaign]
  )

  const contextValue = useMemo(
    () => ({
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      initialDataLoading,
      changeCampaignStatus,
      deleteDraftCampaign,
      toggleArchived,
      editCampaign,
      filterSources
    }),
    [
      campaignsData,
      updateCampaignDataById,
      updateAllCampaignsData,
      initialDataLoading,
      changeCampaignStatus,
      deleteDraftCampaign,
      toggleArchived,
      editCampaign,
      filterSources
    ]
  )

  return (
    <CampaignsDataContext.Provider value={contextValue}>{children}</CampaignsDataContext.Provider>
  )
}

export { CampaignsDataContext, CampaignsDataProvider }
