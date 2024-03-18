import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import superjson from 'superjson'
import { CampaignUI, CreateCampaignType } from 'types'

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const defaultValue = { ...CREATE_CAMPAIGN_DEFAULT_VALUE }

  const [campaign, setCampaign] = useLocalStorage<CampaignUI>({
    key: 'createCampaign',
    defaultValue,
    serialize: superjson.stringify,
    deserialize: (str) => (typeof str === 'undefined' ? defaultValue : superjson.parse(str))
  })

  const updateAllCampaign = useCallback(
    (value: any) => {
      setCampaign(value)
    },
    [setCampaign]
  )

  const updateCampaign = useCallback(
    <CampaignItemKey extends keyof CampaignUI>(
      key: CampaignItemKey,
      value: CampaignUI[CampaignItemKey]
    ) => {
      setCampaign((prevState) => {
        const updated = { ...prevState }
        updated[key] = value
        return updated
      })
    },
    [setCampaign]
  )

  const updateCampaignWithPrevStateNested = useCallback(
    (nestedKey: string, value: any) => {
      setCampaign((prevState) => {
        const updated = { ...prevState }
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
      updateAllCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested
    }),
    [campaign, setCampaign, updateAllCampaign, updateCampaign, updateCampaignWithPrevStateNested]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
