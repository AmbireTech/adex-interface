import { CreateCampaignContext } from 'contexts/CreateCampaignContext'
import { useContext } from 'react'

export default function useCreateCampaignContext() {
  const context = useContext(CreateCampaignContext)

  if (!context)
    throw new Error('useCreateCampaignContext must be used within a CreateCampaignContextProvider')

  return context
}
