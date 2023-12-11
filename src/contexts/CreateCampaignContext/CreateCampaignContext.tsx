import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import { Campaign } from 'types'
import superjson from 'superjson'

type CreateCampaign = {
  campaign: Campaign
  setCampaign: (val: Campaign | ((prevState: Campaign) => Campaign)) => void
  updateCampaign: <CampaignItemKey extends keyof Campaign>(
    key: CampaignItemKey,
    value: Campaign[CampaignItemKey]
  ) => void
  updateCampaignWithPrevStateNested: (nestedKey: string, value: any) => void
}

const CreateCampaignContext = createContext<CreateCampaign | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const defaultValue = { ...CREATE_CAMPAIGN_DEFAULT_VALUE }
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

  const updateCampaignWithPrevStateNested = useCallback(
    (nestedKey: string, value: any) => {
      setCampaign((prevCampaign) => {
        const updated = { ...prevCampaign }
        const keys = nestedKey.split('.')
        let currentLevel: any = updated

        for (let i = 0; i < keys.length - 1; i++) {
          if (!(keys[i] in currentLevel)) {
            currentLevel[keys[i]] = {}
          }
          currentLevel = currentLevel[keys[i]]
        }

        currentLevel[keys[keys.length - 1]] = value
        return updated
      })
    },
    [setCampaign]
  )

  const contextValue = useMemo(
    () => ({
      campaign,
      setCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested
    }),
    [campaign, setCampaign, updateCampaign, updateCampaignWithPrevStateNested]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
