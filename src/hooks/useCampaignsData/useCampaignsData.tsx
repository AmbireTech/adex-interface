import { useContext } from 'react'
import { CampaignsDataContext } from 'contexts/CampaignsContext'

function useCampaignsData() {
  const context = useContext(CampaignsDataContext)
  // NOTE: as there is no way to detect if the context is used with provider
  // and with ts forcing default values for createContext there is always context
  // we can declare contexts as follows:
  // `const CampaignsDataProvider = createContext<ICampaignsDataContext | null>(null)`
  // this way we can use the context as hook and be sure there is provider for it
  // with the next check we guarantee the type of the context (ICampaignsDataContext)
  // NOTE CampaignsDataProvider should be inside AccountProvider
  if (!context) throw new Error('useCampaignsData should be used with CampaignsDataProvider')
  return context
}

function useCampaignsDataAdmin() {
  const context = useContext(CampaignsDataContext)
  // NOTE: as there is no way to detect if the context is used with provider
  // and with ts forcing default values for createContext there is always context
  // we can declare contexts as follows:
  // `const CampaignsDataProvider = createContext<ICampaignsDataContext | null>(null)`
  // this way we can use the context as hook and be sure there is provider for it
  // with the next check we guarantee the type of the context (ICampaignsDataContext)
  // NOTE CampaignsDataProvider should be inside AccountProvider
  if (!context) throw new Error('useCampaignsDataAdmin should be used with CampaignsDataProvider')
  return context
}

export { useCampaignsData, useCampaignsDataAdmin }
