import { FC, PropsWithChildren, createContext, useMemo, useState } from 'react'
import { Campaign } from 'types'

type CreateCampaign = {
  campaign: Campaign | null
  setCampaign: React.Dispatch<React.SetStateAction<Campaign | null>>
}

const CreateCampaignContext = createContext<CreateCampaign | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null)

  return (
    <CreateCampaignContext.Provider
      value={useMemo(
        () => ({
          campaign,
          setCampaign
        }),
        [campaign]
      )}
    >
      {children}
    </CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
