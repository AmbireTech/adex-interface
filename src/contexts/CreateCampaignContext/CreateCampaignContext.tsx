import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { Campaign } from 'types'
import superjson from 'superjson'

type CreateCampaign = {
  campaign: Campaign
  setCampaign: (val: Campaign | ((prevState: Campaign) => Campaign)) => void
  updateCampaign: (x: any, y: any) => void
}

const CreateCampaignContext = createContext<CreateCampaign | null>(null)

const defaultValue: Campaign = {
  id: '',
  creator: '',
  depositAssetAddr: '',
  depositAmount: BigInt(0),
  network: 0,
  created: BigInt(0),
  nonce: BigInt(0),
  title: '',
  adUnits: [],
  validators: [],
  pricingBounds: {
    IMPRESSION: {
      min: BigInt(0),
      max: BigInt(0)
    },
    CLICK: {
      min: BigInt(0),
      max: BigInt(0)
    }
  },
  targetingRules: [],
  targetingInput: {
    version: '',
    inputs: {
      location: [],
      categories: [],
      publishers: []
    }
  }
}

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [campaign, setCampaign] = useLocalStorage<Campaign>({
    key: 'createCampaign',
    defaultValue,
    serialize: superjson.stringify,
    deserialize: (str) => (str === undefined ? defaultValue : superjson.parse(str))
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
