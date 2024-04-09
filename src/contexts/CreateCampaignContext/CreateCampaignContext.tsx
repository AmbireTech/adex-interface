import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import superjson, { serialize } from 'superjson'
import { CampaignUI, CreateCampaignType } from 'types'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import { mapCampaignUItoCampaign } from 'helpers/createCampaignHelpers'

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // TODO: the address will be fixed and will always has a default value
  const { adexAccount } = useAccount()

  const defaultValue = useMemo(
    () => ({
      ...CREATE_CAMPAIGN_DEFAULT_VALUE,
      owner: adexAccount?.address || '',
      createdBy: adexAccount?.address || '',
      // TODO: fix outpaceAssetAddr
      outpaceAssetAddr: adexAccount?.address || '',
      outpaceAddr: adexAccount?.address || '',
      outpaceAssetDecimals: 18
    }),
    [adexAccount?.address]
  )

  const [campaign, setCampaign] = useLocalStorage<CampaignUI>({
    key: 'createCampaign',
    defaultValue,
    serialize: superjson.stringify,
    deserialize: (str) => (typeof str === 'undefined' ? defaultValue : superjson.parse(str))
  })

  const { adexServicesRequest } = useAdExApi()

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

  const resetCampaign = useCallback(
    () => setCampaign({ ...defaultValue }),
    [setCampaign, defaultValue]
  )

  const publishCampaign = useCallback(() => {
    const mappedCampaign = mapCampaignUItoCampaign(campaign)
    mappedCampaign.id = `${campaign.title}-${Date.now().toString(16)}`

    const body = serialize(mappedCampaign).json

    return adexServicesRequest('backend', {
      route: '/dsp/campaigns',
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [campaign, adexServicesRequest])

  const contextValue = useMemo(
    () => ({
      campaign,
      setCampaign,
      updateAllCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested,
      publishCampaign,
      resetCampaign
    }),
    [
      campaign,
      setCampaign,
      updateAllCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested,
      publishCampaign,
      resetCampaign
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
