import { createContext, FC, PropsWithChildren, useMemo, useState } from 'react'

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
}

const AnalyticsContext = createContext<IAnalyticsContext | null>(null)

const AnalyticsProvider: FC<PropsWithChildren> = ({ children }) => {
  // eslint-disable-next-line
  const [campaignsData, setCampaignData] = useState<Map<string, CampaignData>>(
    new Map<string, CampaignData>()
  )

  const contextValue = useMemo(
    () => ({
      campaignsData
    }),
    [campaignsData]
  )

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>
}

export { AnalyticsContext, AnalyticsProvider }
