import { useContext } from 'react'
import { CampaignsAnalyticsContext } from 'contexts/CampaignsContext'

function useCampaignsAnalytics() {
  const context = useContext(CampaignsAnalyticsContext)
  // NOTE: as there is no way to detect if the context is used with provider
  // and with ts forcing default values for createContext there is always context
  // we can declare contexts as follows:
  // `const CampaignsAnalyticsProvider = createContext<ICampaignsAnalyticsContext | null>(null)`
  // this way we can use the context as hook and be sure there is provider for it
  // with the next check we guarantee the type of the context (ICampaignsAnalyticsContext)
  // NOTE CampaignsAnalyticsProvider should be inside AccountProvider ans inside CampaignsDataProvider
  if (!context) throw new Error('useCampaignsData should be used with CampaignsDataProvider')
  return context
}
export default useCampaignsAnalytics
