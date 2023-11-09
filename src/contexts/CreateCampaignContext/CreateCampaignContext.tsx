import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import { Campaign } from 'types'
import superjson from 'superjson'

type CreateCampaign = {
  campaign: Campaign
  setCampaign: (val: Campaign | ((prevState: Campaign) => Campaign)) => void
  updateCampaign: (x: any, y: any) => void
}

const CreateCampaignContext = createContext<CreateCampaign | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const defaultValue = CREATE_CAMPAIGN_DEFAULT_VALUE
  const [campaign, setCampaign] = useLocalStorage<Campaign>({
    key: 'createCampaign',
    defaultValue,
    serialize: superjson.stringify,
    deserialize: (str) => (typeof str === 'undefined' ? defaultValue : superjson.parse(str))
  })

  const updateCampaign = useCallback(
    <CampaignItemKey extends keyof Campaign>(
      key: CampaignItemKey,
      value: Campaign[CampaignItemKey]
    ) => {
      setCampaign((x) => {
        const updated = { ...x }
        updated[key] = value
        return updated
      })
    },
    [setCampaign]
  )

  const contextValue = useMemo(
    () => ({
      campaign,
      setCampaign,
      updateCampaign
    }),
    [campaign, setCampaign, updateCampaign]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
