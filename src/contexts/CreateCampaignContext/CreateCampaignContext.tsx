import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { CREATE_CAMPAIGN_DEFAULT_VALUE, dateNowPlusThirtyDays } from 'constants/createCampaign'
import superjson, { serialize } from 'superjson'
import { SupplyStats, CampaignUI, CreateCampaignType, SupplyStatsDetails, Devices } from 'types'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import {
  addUrlUtmTracking,
  deepEqual,
  hasUtmCampaign,
  isPastDateTime,
  prepareCampaignObject,
  selectBannerSizes
} from 'helpers/createCampaignHelpers'
import { parseFromBigNumPrecision } from 'helpers/balances'
import { AdUnit, Campaign, Placement } from 'adex-common'
import dayjs from 'dayjs'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { formatDateTime } from 'helpers'
import { isValidHttpUrl } from 'helpers/validators'

const mockData = {
  appBannerFormats: [
    {
      value: '320x50',
      count: 5583960
    },
    {
      value: '300x50',
      count: 3862456
    },
    {
      value: '250x50',
      count: 2240770
    },
    {
      value: '728x90',
      count: 1735665
    },
    {
      value: '300x250',
      count: 1136181
    }
  ],
  siteBannerFormatsDesktop: [
    {
      value: '300x250',
      count: 727348
    },
    {
      value: '728x90',
      count: 689367
    },
    {
      value: '300x50',
      count: 657506
    },
    {
      value: '160x90',
      count: 630174
    }
  ],
  siteBannerFormatsMobile: [
    {
      value: '300x250',
      count: 1432677
    },
    {
      value: '320x50',
      count: 863368
    },
    {
      value: '300x50',
      count: 819345
    }
  ],
  appBidFloors: [
    {
      value: '0_20-0_30',
      count: 2355568
    },
    {
      value: '0_50-1_00',
      count: 425406
    },
    {
      value: '1_00-2_00',
      count: 339714
    },
    {
      value: '0_30-0_50',
      count: 333687
    }
  ],
  siteDesktopBidFloors: [
    {
      value: '1_00-2_00',
      count: 101983
    },
    {
      value: '0_50-1_00',
      count: 95211
    },
    {
      value: '0_20-0_30',
      count: 77664
    }
  ],
  siteMobileBidFloors: [
    {
      value: '1_00-2_00',
      count: 94638
    },
    {
      value: '0_50-1_00',
      count: 93996
    }
  ]
}

const supplyStatsDefaultValue = {
  appBannerFormats: [],
  siteBannerFormatsDesktop: [],
  siteBannerFormatsMobile: [],
  appBidFloors: [],
  siteDesktopBidFloors: [],
  siteMobileBidFloors: []
}

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
  const { showNotification } = useCustomNotifications()
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

  const [campaign, setCampaign] = useState<CampaignUI>(defaultValue)
  const [supplyStats, setSupplyStats] = useState<SupplyStats>(supplyStatsDefaultValue)
  const [selectedBannerSizes, setSelectedBannerSizes] = useState<
    SupplyStatsDetails[] | SupplyStatsDetails[][]
  >([])
  const [selectedBidFloors, setSelectedBidFloors] = useState<
    SupplyStatsDetails[] | SupplyStatsDetails[][]
  >([])

  useEffect(() => {
    const placement = campaign.targetingInput.inputs.placements.in[0]
    const devices = campaign.devices
    const mappedSupplyStats: Record<string, SupplyStatsDetails[][]> = selectBannerSizes(supplyStats)
    const selectedPlatforms: Placement | Devices[] = placement === 'app' ? placement : devices
    if (Array.isArray(selectedPlatforms)) {
      const result = selectedPlatforms.map((platform) => mappedSupplyStats[platform][0])
      setSelectedBannerSizes(result)
      setSelectedBidFloors(selectedPlatforms.map((platform) => mappedSupplyStats[platform][1]))
    } else {
      setSelectedBannerSizes(selectedPlatforms ? mappedSupplyStats[selectedPlatforms][0] : [])
      setSelectedBidFloors(selectedPlatforms ? mappedSupplyStats[selectedPlatforms][1] : [])
    }
  }, [campaign.devices, campaign.targetingInput.inputs.placements.in, supplyStats])

  useEffect(() => {
    const savedCampaign = localStorage.getItem('createCampaign')
    if (savedCampaign) {
      const parsedCampaign = superjson.parse<CampaignUI>(savedCampaign)
      if (!deepEqual(parsedCampaign, defaultValue)) {
        setCampaign(parsedCampaign)
      }
    }
  }, [defaultValue])

  const getSupplyStats = useCallback(async () => {
    let result

    try {
      result = await adexServicesRequest('backend', {
        route: '/dsp/stats/common',
        method: 'GET'
      })

      if (!result) {
        throw new Error('Getting banner sizes failed.')
      }

      const hasEmptyValueResponse = Object.values(result).every(
        (value) => Array.isArray(value) && value.length === 0
      )

      if (hasEmptyValueResponse) {
        result = mockData
      }

      setSupplyStats(result as SupplyStats)
    } catch (e) {
      console.error(e)
      showNotification('error', 'Getting banner sizes failed', 'Getting banner sizes failed')
      // TODO: add fallback or just use mock data
      result = mockData
      setSupplyStats(result)
    }
  }, [adexServicesRequest, showNotification])

  useEffect(() => {
    getSupplyStats()
  }, []) // eslint-disable-line

  useEffect(() => {
    window.onbeforeunload = () => {
      setCampaign((prev) => {
        localStorage.setItem('createCampaign', superjson.stringify(prev))
        return prev
      })
      return undefined
    }

    return () => {
      window.onbeforeunload = null
    }
  }, [])

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

  const addUTMToTargetURLS = useCallback(() => {
    setCampaign((prev) => {
      const {
        adUnits,
        autoUTMChecked,
        title,
        targetingInput: {
          inputs: {
            placements: {
              in: [placement]
            }
          }
        }
      } = { ...prev }

      if (autoUTMChecked) {
        adUnits.forEach((element) => {
          const elCopy = { ...element }
          if (!isValidHttpUrl(elCopy.banner!.targetUrl)) {
            return elCopy
          }

          elCopy.banner!.targetUrl = addUrlUtmTracking({
            targetUrl: elCopy.banner!.targetUrl,
            campaign: title,
            content: `${elCopy.banner!.format.w}x${elCopy.banner!.format.h}`,
            term: placement === 'app' ? 'App' : 'Website'
          })
          return elCopy
        })
      }

      const updated = {
        ...prev,
        adUnits
      }
      return updated
    })
  }, [setCampaign])

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
        updated.draftModified = true
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

  const resetCampaign = useCallback(() => {
    setCampaign({ ...defaultValue })
    localStorage.setItem('createCampaign', superjson.stringify({ ...defaultValue }))
  }, [setCampaign, defaultValue])

  const publishCampaign = useCallback(() => {
    const preparedCampaign = prepareCampaignObject(campaign, balanceToken.decimals)

    const body = serialize(preparedCampaign).json

    return adexServicesRequest('backend', {
      route: '/dsp/campaigns',
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [campaign, adexServicesRequest, balanceToken.decimals])

  const saveToDraftCampaign = useCallback(
    (camp?: CampaignUI) => {
      const currCampaign = camp || campaign
      const preparedCampaign = prepareCampaignObject(currCampaign, balanceToken.decimals)

      if (defaultValue.startsAt === currCampaign.startsAt) {
        preparedCampaign.activeFrom = null
      }
      if (defaultValue.endsAt === currCampaign.endsAt) {
        preparedCampaign.activeTo = null
      }
      if (preparedCampaign.title === '') {
        preparedCampaign.title = `Draft Campaign ${formatDateTime(new Date())}`
      }

      const body = serialize(preparedCampaign).json

      return adexServicesRequest('backend', {
        route: '/dsp/campaigns/draft',
        method: 'POST',
        body,
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },
    [
      campaign,
      adexServicesRequest,
      balanceToken.decimals,
      defaultValue.startsAt,
      defaultValue.endsAt
    ]
  )

  const updateCampaignFromDraft = useCallback(
    (draftCampaign: Campaign) => {
      const mappedDraftCampaign: CampaignUI = {
        ...draftCampaign,
        step: 0,
        devices: ['mobile', 'desktop'],
        paymentModel: 'cpm',
        autoUTMChecked: draftCampaign.adUnits.every((adUnit) =>
          hasUtmCampaign(adUnit.banner?.targetUrl || '')
        ),
        asapStartingDate: false,
        startsAt:
          (draftCampaign?.activeFrom && new Date(Number(draftCampaign?.activeFrom))) || new Date(),
        endsAt:
          (draftCampaign?.activeTo && new Date(Number(draftCampaign?.activeTo))) ||
          dateNowPlusThirtyDays(),
        currency: balanceToken.name,
        cpmPricingBounds: {
          min: parseFromBigNumPrecision(
            BigInt(Number(draftCampaign.pricingBounds.IMPRESSION!.min) * 1000),
            draftCampaign.outpaceAssetDecimals
          ).toString(),
          max: parseFromBigNumPrecision(
            BigInt(Number(draftCampaign.pricingBounds.IMPRESSION!.max) * 1000),
            draftCampaign.outpaceAssetDecimals
          ).toString()
        },
        campaignBudget: BigInt(
          parseFromBigNumPrecision(
            BigInt(Math.floor(Number(draftCampaign.campaignBudget))),
            draftCampaign.outpaceAssetDecimals
          )
        ),
        draftModified: false
      }

      setCampaign(mappedDraftCampaign)
    },
    [balanceToken.name]
  )

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
      addTargetURLToAdUnit,
      selectedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors
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
      addTargetURLToAdUnit,
      selectedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
