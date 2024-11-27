import { useContext } from 'react'
import { SSPsAnalyticsContext } from 'contexts/CampaignsContext'

function useSSPsAnalytics() {
  const context = useContext(SSPsAnalyticsContext)
  // NOTE: as there is no way to detect if the context is used with provider
  // and with ts forcing default values for createContext there is always context
  // we can declare contexts as follows:
  // `const SSPsAnalyticsProvider = createContext<SSPsAnalyticsContext | null>(null)`
  // this way we can use the context as hook and be sure there is provider for it
  // with the next check we guarantee the type of the context (ICampaignsAnalyticsContext)
  // NOTE SSPsAnalyticsProvider should be inside AccountProvider
  if (!context) throw new Error('useSSPsAnalytics should be used with SSPsAnalyticsProvider')
  return context
}
export default useSSPsAnalytics
