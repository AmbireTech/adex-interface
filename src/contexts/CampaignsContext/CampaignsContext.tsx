import { Campaign } from 'adex-common'
import { createContext, FC, PropsWithChildren, useMemo, useState, useCallback } from 'react'
// import useFetch from 'hooks/useFetchRequest'

// NOTE: Will put here all the campaigns data and analytics for ease of use
// Laater we can separate the analytics in different context

type CampaignData = {
  campaignId: string
  campaign: Campaign
  status: 'loading' | 'updating' | 'done'
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

interface ICampaignsDataContext {
  campaignsData: Map<string, CampaignData>
  // TODO: all campaigns event aggregations by account
  eventAggregates: any
  updateCampaignDataById: (params: string) => void
  updateAllCampaignsData: () => void
}

const CampaignsDataContext = createContext<ICampaignsDataContext | null>(null)

const CampaignsDataProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line
  const [campaignsData, setCampaignData] = useState<Map<string, CampaignData>>(
    new Map<string, CampaignData>()
  )

  // eslint-disable-next-line
  const [eventAggregates, setEventAggregates] = useState<any>({})

  const updateCampaignDataById = useCallback((campaignId: string) => {
    console.log({ campaignId })
    // TODO
  }, [])

  const updateAllCampaignsData = useCallback(() => {
    // TODO
  }, [])

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
