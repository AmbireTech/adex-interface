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
import superjson from 'superjson'
import {
  CampaignUI,
  CreateCampaignType,
  SupplyStatsDetails,
  Devices,
  ErrorsTargetURLValidations
} from 'types'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import {
  addUrlUtmTracking,
  deepEqual,
  hasUtmCampaign,
  prepareCampaignObject,
  removeProperty,
  selectBannerSizes
} from 'helpers/createCampaignHelpers'
import { parseFromBigNumPrecision } from 'helpers/balances'
import { AdUnit, Campaign, Placement } from 'adex-common'
import { formatDateTime, WEEK } from 'helpers'
import { isValidHttpUrl } from 'helpers/validators'
import { useCampaignsData } from 'hooks/useCampaignsData'

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
  const { supplyStats, updateSupplyStats } = useCampaignsData()
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
      startsAt: new Date(),
      endsAt: new Date(Date.now() + WEEK),
      errorsTargetURLValidations: {}
    }),
    [adexAccount?.address, balanceToken?.address, balanceToken?.decimals, balanceToken?.chainId]
  )

  const [campaign, setCampaign] = useState<CampaignUI>(defaultValue)
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

  useEffect(() => {
    updateSupplyStats()
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
        const { errorsTargetURLValidations } = { ...prev }
        const nextValidations = { ...errorsTargetURLValidations }
        errorsTargetURLValidations[adUnitToAdd.id] = {
          errMsg: '',
          success: false,
          isDirty: false
        }
        const updated = {
          ...prev,
          adUnits: [...prev.adUnits, adUnitToAdd],
          errorsTargetURLValidations: nextValidations
        }
        return updated
      })
    },
    [setCampaign]
  )

  const removeAdUnit = useCallback(
    (adUnitIdToRemove: string) => {
      setCampaign((prev) => {
        const { errorsTargetURLValidations } = { ...prev }
        const nextValidations = { ...errorsTargetURLValidations }

        const updated = {
          ...prev,
          adUnits: [...prev.adUnits.filter((item) => item.id !== adUnitIdToRemove)],
          errorsTargetURLValidations: removeProperty(adUnitIdToRemove, nextValidations)
        }
        return updated
      })
    },
    [setCampaign]
  )

  const validateAdUnitTargetURL = useCallback(() => {
    setCampaign((prev) => {
      const adUnits = [...prev.adUnits]
      const errorsTargetURLValidations = { ...prev.errorsTargetURLValidations }

      const mappedAdUnits = adUnits.map((element) => {
        const elCopy = { ...element }

        if (elCopy.banner?.targetUrl === '') {
          errorsTargetURLValidations[elCopy.id] = {
            isDirty: true,
            errMsg: '',
            success: false
          }
        } else if (elCopy.banner?.targetUrl && !isValidHttpUrl(elCopy.banner?.targetUrl)) {
          errorsTargetURLValidations[elCopy.id] = {
            isDirty: true,
            errMsg: 'Please enter a valid URL',
            success: false
          }
        } else {
          errorsTargetURLValidations[elCopy.id] = {
            isDirty: true,
            errMsg: '',
            success: true
          }
        }

        return elCopy
      })

      return {
        ...prev,
        adUnits: mappedAdUnits,
        errorsTargetURLValidations
      }
    })
  }, [setCampaign])

  const addTargetURLToAdUnit = useCallback(
    (inputText: string, adUnitId: string) => {
      setCampaign((prev) => {
        const { adUnits, errorsTargetURLValidations } = { ...prev }
        const nextValidations = { ...errorsTargetURLValidations }
        const mappedAdUnits = adUnits.map((element) => {
          const elCopy = { ...element }

          if (elCopy.id === adUnitId) {
            elCopy.banner!.targetUrl = inputText

            if (elCopy.banner?.targetUrl === '') {
              nextValidations[elCopy.id] = { errMsg: '', success: false, isDirty: true }
            } else if (elCopy.banner?.targetUrl && !isValidHttpUrl(elCopy.banner?.targetUrl)) {
              nextValidations[elCopy.id] = {
                errMsg: 'Please enter a valid URL',
                success: false,
                isDirty: true
              }
            } else {
              nextValidations[elCopy.id] = { errMsg: '', success: true, isDirty: true }
            }
          }

          return elCopy
        })

        const updated = {
          ...prev,
          adUnits: mappedAdUnits,
          errorsTargetURLValidations: nextValidations
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
        updated.dirty = true
        return updated
      })
    },
    [setCampaign]
  )

  // NOTE: what exactly is the purpose fo this fn ??? Why can not work with updateCampaign or updatePartOfCampaign
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
        updated.dirty = true
        return updated
      })
    },
    [setCampaign]
  )

  const resetCampaign = useCallback(() => {
    console.log('resetCampaign', defaultValue)
    const toSetReset = {
      ...defaultValue,
      // NOTE: tem fix for reset. Looks like default value is mutated with draft campaigns. It needs total re-write of the create campaign logic.
      // Will not waste more time atm to fix this
      errorsTargetURLValidations: {},
      startsAt: new Date(),
      endsAt: new Date(Date.now() + WEEK),
      dirty: false
    }
    setCampaign(toSetReset)
    // Do we need this???
    localStorage.setItem('createCampaign', superjson.stringify(toSetReset))
  }, [setCampaign, defaultValue])

  const publishCampaign = useCallback(() => {
    const preparedCampaign = prepareCampaignObject(campaign, balanceToken.decimals)

    return adexServicesRequest('backend', {
      route: '/dsp/campaigns',
      method: 'POST',
      body: preparedCampaign,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [campaign, adexServicesRequest, balanceToken.decimals])

  const saveToDraftCampaign = useCallback(
    async (camp?: CampaignUI) => {
      const currCampaign = camp || campaign
      const preparedCampaign = prepareCampaignObject(currCampaign, balanceToken.decimals)

      preparedCampaign.title =
        preparedCampaign.title || `Draft Campaign ${formatDateTime(new Date())}`

      try {
        const res = await adexServicesRequest('backend', {
          route: '/dsp/campaigns/draft',
          method: 'POST',
          body: preparedCampaign,
          headers: {
            'Content-Type': 'application/json'
          }
        })

        // TODO: resp Type
        // @ts-ignore
        if (!res || !res?.success) {
          throw new Error('Error on saving draft campaign')
        }
        return res
      } catch (err) {
        throw new Error('Error on saving draft campaign')
      }
    },
    [campaign, adexServicesRequest, balanceToken.decimals]
  )

  const updateCampaignFromDraft = useCallback(
    (draftCampaign: Campaign) => {
      const errorsTargetURLValidations = draftCampaign.adUnits.reduce((acc, adUnit) => {
        const targetUrl = adUnit.banner?.targetUrl || ''
        const validationResult = {
          isDirty: false,
          errMsg: '',
          success: false
        }

        if (targetUrl === '') {
          validationResult.errMsg = ''
        } else if (!isValidHttpUrl(targetUrl)) {
          validationResult.errMsg = 'Please enter a valid URL'
        } else {
          validationResult.success = true
        }

        acc[adUnit.id] = validationResult
        return acc
      }, {} as ErrorsTargetURLValidations)

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
        dirty: false,
        errorsTargetURLValidations
      }

      setCampaign(mappedDraftCampaign)
    },
    [balanceToken.name]
  )

  const contextValue = useMemo(
    () => ({
      campaign,
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
      selectedBidFloors,
      validateAdUnitTargetURL
    }),
    [
      campaign,
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
      selectedBidFloors,
      validateAdUnitTargetURL
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
