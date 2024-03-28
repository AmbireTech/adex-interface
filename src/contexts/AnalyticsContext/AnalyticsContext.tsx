import { createContext, FC, PropsWithChildren, useMemo, useState, useCallback } from 'react'
// import useFetch from 'hooks/useFetchRequest'

type CampaignData = {
  campaignId: string
  status: 'loading' | 'updating' | 'done'
  impressions: Number
  clicks: Number
  // clicks / impressions * 100
  crt: Number
  // payed / impressions * 1000
  avgCpm: Number
  payed: Number
  // TODO: by timeframe etc...
}

interface IAnalyticsContext {
  campaignsData: Map<string, CampaignData>
  updateCampaignDataById: (params: string) => void
  updateAllCampaignsData: () => void
}

const AnalyticsContext = createContext<IAnalyticsContext | null>(null)

const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line
  const [campaignsData, setCampaignData] = useState<Map<string, CampaignData>>(
    new Map<string, CampaignData>()
  )

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
      updateAllCampaignsData
    }),
    [campaignsData, updateCampaignDataById, updateAllCampaignsData]
  )

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>
}

export { AnalyticsContext, AnalyticsProvider }
