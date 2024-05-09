import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import superjson, { serialize } from 'superjson'
import { CampaignUI, CreateCampaignType } from 'types'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import { isPastDateTime, mapCampaignUItoCampaign } from 'helpers/createCampaignHelpers'
import { parseToBigNumPrecision } from 'helpers/balances'
import { AdUnit } from 'adex-common'
import dayjs from 'dayjs'

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  // TODO: the address will be fixed and will always has a default value
  const {
    adexAccount,
    adexAccount: { balanceToken }
  } = useAccount()

  const defaultValue = useMemo(
    () => ({
      ...CREATE_CAMPAIGN_DEFAULT_VALUE,
      owner: adexAccount?.address || '',
      createdBy: adexAccount?.address || '',
      // TODO: fix outpaceAssetAddr
      outpaceAssetAddr: balanceToken?.address || '',
      outpaceAddr: adexAccount?.address || '0x',
      outpaceAssetDecimals: balanceToken.decimals,
      outpaceChainId: balanceToken.chainId,
      startsAt: isPastDateTime(CREATE_CAMPAIGN_DEFAULT_VALUE.startsAt)
        ? dayjs().add(1, 'hour').toDate()
        : CREATE_CAMPAIGN_DEFAULT_VALUE.startsAt
    }),
    [adexAccount?.address, balanceToken?.address, balanceToken?.decimals, balanceToken?.chainId]
  )

  const [campaign, setCampaign] = useLocalStorage<CampaignUI>({
    key: 'createCampaign',
    defaultValue,
    serialize: superjson.stringify,
    deserialize: (str) => (typeof str === 'undefined' ? defaultValue : superjson.parse(str))
  })

  const { adexServicesRequest } = useAdExApi()

  const addAdUnit = useCallback(
    (adUnitToAdd: AdUnit) => {
      setCampaign((prev) => {
        const updated = { ...prev, adUnits: [...prev.adUnits, adUnitToAdd] }
        return updated
      })
    },
    [setCampaign]
  )

  const removeAdUnit = useCallback(
    (adUnitIdToRemove: string) => {
      setCampaign((prev) => {
        const updated = {
          ...prev,
          adUnits: [...prev.adUnits.filter((item) => item.id !== adUnitIdToRemove)]
        }
        return updated
      })
    },
    [setCampaign]
  )

  const addTargetURLToAdUnit = useCallback(
    (inputText: string, adUnitId: string) => {
      setCampaign((prev) => {
        const { adUnits } = { ...prev }

        adUnits.forEach((element) => {
          const elCopy = { ...element }
          if (elCopy.id === adUnitId) elCopy.banner!.targetUrl = inputText
          return elCopy
        })

        const updated = {
          ...prev,
          adUnits
        }
        return updated
      })
    },
    [setCampaign]
  )

  const updatePartOfCampaign = useCallback(
    (value: Partial<CampaignUI>) => {
      setCampaign((prevState) => ({
        ...prevState,
        ...value
      }))
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
    mappedCampaign.campaignBudget = parseToBigNumPrecision(
      Number(mappedCampaign.campaignBudget),
      balanceToken.decimals
    )
    mappedCampaign.pricingBounds.IMPRESSION!.min = parseToBigNumPrecision(
      Number(campaign.cpmPricingBounds.min) / 1000,
      balanceToken.decimals
    )
    mappedCampaign.pricingBounds.IMPRESSION!.max = parseToBigNumPrecision(
      Number(campaign.cpmPricingBounds.max) / 1000,
      balanceToken.decimals
    )
    mappedCampaign.activeFrom = BigInt(campaign.startsAt.getTime())
    mappedCampaign.activeTo = BigInt(campaign.endsAt.getTime())

    const body = serialize(mappedCampaign).json

    return adexServicesRequest('backend', {
      route: '/dsp/campaigns',
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [campaign, adexServicesRequest, balanceToken.decimals])

  const contextValue = useMemo(
    () => ({
      campaign,
      setCampaign,
      updatePartOfCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested,
      publishCampaign,
      resetCampaign,
      addAdUnit,
      removeAdUnit,
      addTargetURLToAdUnit
    }),
    [
      campaign,
      setCampaign,
      updatePartOfCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested,
      publishCampaign,
      resetCampaign,
      addAdUnit,
      removeAdUnit,
      addTargetURLToAdUnit
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
