import { useLocalStorage } from '@mantine/hooks'
import { FC, PropsWithChildren, createContext, useCallback, useMemo } from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE } from 'constants/createCampaign'
import superjson, { serialize } from 'superjson'
import { CampaignUI, CreateCampaignType } from 'types'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import { mapCampaignUItoCampaign } from 'helpers/createCampaignHelpers'
import { parseToBigNumPrecision } from 'helpers/balances'
import { isValidHttpUrl } from 'helpers/validators'
import { AdUnit } from 'adex-common'

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
      outpaceChainId: balanceToken.chainId
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

  // TODO: move it in validator file
  const validateField = useCallback((value: string | undefined) => {
    if (!value || value.length === 0) {
      return 'Enter a target URL'
    }
    if (!isValidHttpUrl(value)) {
      return 'Please enter a valid URL'
    }
    return ''
  }, [])

  const validateAdUnits = useCallback(() => {
    setCampaign((prevState) => {
      const updated = {
        ...prevState,
        ...prevState.adUnitsExtended.map((item) => {
          const copy = { ...item }
          copy.error = validateField(item.banner?.targetUrl)
          return copy
        })
      }

      return updated
    })
  }, [setCampaign, validateField])

  const resetCampaign = useCallback(
    () => setCampaign({ ...defaultValue }),
    [setCampaign, defaultValue]
  )

  const publishCampaign = useCallback(() => {
    const mappedCampaign = mapCampaignUItoCampaign(campaign)

    mappedCampaign.id = `${campaign.title}-${Date.now().toString(16)}`
    mappedCampaign.adUnits = [...(campaign.adUnitsExtended as AdUnit[])]

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
      validateAdUnits
    }),
    [
      campaign,
      setCampaign,
      updatePartOfCampaign,
      updateCampaign,
      updateCampaignWithPrevStateNested,
      publishCampaign,
      resetCampaign,
      validateAdUnits
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
