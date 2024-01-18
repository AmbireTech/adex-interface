import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import superjson from 'superjson'
import { Banners, CampaignUI } from 'types'

type CreateCampaign = {
  campaign: CampaignUI
  setCampaign: (val: CampaignUI | ((prevState: CampaignUI) => CampaignUI)) => void
  updateCampaign: <CampaignItemKey extends keyof CampaignUI>(
    key: CampaignItemKey,
    value: CampaignUI[CampaignItemKey]
  ) => void
  updateCampaignWithPrevStateNested: (nestedKey: string, value: any) => void
  updateAllCampaign: (camp: any) => void
  updateCampaignAdUnits: (value: Banners) => void
}

const CreateCampaignContext = createContext<CreateCampaign | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // const defaultValue1 = { ...CREATE_CAMPAIGN_DEFAULT_VALUE }
  const defaultValue = structuredClone(CREATE_CAMPAIGN_DEFAULT_VALUE)

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
      setCampaign((x) => {
        // const updated = { ...x }
        const updated = structuredClone(x)
        updated[key] = value
        return updated
      })
    },
    [setCampaign]
  )

  const updateCampaignAdUnits = useCallback(
    (value: Banners) => {
      setCampaign((x) => ({ ...x, creativesDetails: value }))
    },
    [setCampaign]
  )

  const updateCampaignWithPrevStateNested = useCallback(
    (nestedKey: string, value: any) => {
      setCampaign((prevCampaign) => {
        const keys = nestedKey.split('.')
        let currentLevel: any = structuredClone(prevCampaign)

        for (let i = 0; i < keys.length - 1; i++) {
          if (!(keys[i] in currentLevel)) {
            currentLevel[keys[i]] = {}
          }
          currentLevel = currentLevel[keys[i]]
        }

        currentLevel[keys[keys.length - 1]] = value
        return currentLevel
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
      updateCampaignWithPrevStateNested,
      updateCampaignAdUnits
    }),
    [
      campaign,
      setCampaign,
      updateAllCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested,
      updateCampaignAdUnits
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
