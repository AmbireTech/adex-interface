import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import { useAdExApi } from 'hooks/useAdexServices'
import superjson, { serialize } from 'superjson'
import { CampaignUI, CreateCampaignType } from 'types'

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
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

  const publishCampaign = useCallback(() => {
    const bodyData = serialize({
      ...campaign,
      title: campaign.campaignName,
      id: `${campaign.title.toLowerCase().replace(' ', '-')}-${new Date().getTime()}`,
      outpaceAssetAddr: '0x1234567890123456789012345678901234567890',
      outpaceAddr: '0x1234567890123456789012345678901234567890',
      targetingInput: {
        ...campaign.targetingInput,
        version: '123'
      },
      // used for back-up as I can't upload images
      adUnits: [
        {
          id: '123',
          title: 'test',
          type: 0,
          banner: {
            format: {
              w: 300,
              h: 50
            },
            mime: 'image/jpg',
            mediaUrl: 'https://http.cat/200',
            targetUrl: 'https://http.cat/200',
            created: +new Date()
          }
        }
      ]
    }).json
    // @ts-ignore
    delete bodyData?.targetingInput?.inputs.placements
    // @ts-ignore
    delete bodyData?.step
    // @ts-ignore
    delete bodyData?.devices
    // @ts-ignore
    delete bodyData?.paymentModel

    adexServicesRequest('backend', {
      route: '/dsp/campaigns/',
      method: 'POST',
      body: bodyData,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [campaign])

  const contextValue = useMemo(
    () => ({
      campaign,
      publishCampaign,
      setCampaign,
      updateAllCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested
    }),
    [
      campaign,
      publishCampaign,
      setCampaign,
      updateAllCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
