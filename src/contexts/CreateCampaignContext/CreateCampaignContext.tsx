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
import { CampaignUI, CreateCampaignType, SupplyStatsDetails, Devices } from 'types'
import useAccount from 'hooks/useAccount'
import { useAdExApi } from 'hooks/useAdexServices'
import {
  addUrlUtmTracking,
  deepEqual,
  hasUtmCampaign,
  selectBannerSizes
} from 'helpers/createCampaignHelpers'
import {
  parseBigNumTokenAmountToDecimal,
  parseFromBigNumPrecision,
  parseToBigNumPrecision
} from 'helpers/balances'
import { AdUnit, Campaign, Placement } from 'adex-common'
import { formatDateTime, WEEK } from 'helpers'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { hasLength, isNotEmpty, useForm } from '@mantine/form'

type Modify<T, R> = Omit<T, keyof R> & R

type ReducedCampaign = Omit<
  Modify<Campaign, { id?: string; activeFrom: bigint | null; activeTo: bigint | null }>,
  | 'created'
  | 'owner'
  | 'validators'
  | 'targetingRules'
  | 'status'
  | 'reviewStatus'
  | 'modified'
  | 'archived'
  | 'createdBy'
  | 'lastModifiedBy'
>

const MIN_CAMPAIGN_BUDGET_VALUE_ADMIN = 20
const MIN_CAMPAIGN_BUDGET_VALUE = 300
const MIN_CPM_VALUE = 0.1

const isValidHttpUrl = (inputURL: string) => {
  let url

  try {
    url = new URL(inputURL)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

const validateBudget = (value: bigint, availableBalance: bigint, decimals: number) => {
  const formattedToken = Number(parseBigNumTokenAmountToDecimal(availableBalance, decimals))
  return formattedToken < Number(value)
}

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
  const { supplyStats, updateSupplyStats } = useCampaignsData()
  // TODO: the address will be fixed and will always has a default value
  const {
    adexAccount,
    adexAccount: {
      availableBalance,
      balanceToken,
      balanceToken: { decimals }
    },
    isAdmin
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
      endsAt: new Date(Date.now() + WEEK)
    }),
    [adexAccount?.address, balanceToken?.address, balanceToken?.decimals, balanceToken?.chainId]
  )

  const form = useForm({
    initialValues: defaultValue,
    // validateInputOnChange: ['budget'],
    validateInputOnBlur: true,
    validate: {
      adUnits: {
        banner: {
          targetUrl: (value, { step }) =>
            step === 0 && !isValidHttpUrl(value) ? 'Please enter a valid URL' : null
        }
      },
      targetingInput: {
        inputs: {
          categories: ({ apply, in: isin, nin }, { step }) => {
            if (step === 1) {
              if (apply === 'in' && !isin.length) {
                return 'Categories list cannot be empty'
              }
              if (apply === 'nin' && !nin.length) {
                return 'Categories list cannot be empty'
              }
            }

            return null
          },
          location: ({ apply, in: isin, nin }, { step }) => {
            if (step === 1) {
              if (apply === 'in' && !isin.length) {
                return 'Countries list cannot be empty'
              }
              if (apply === 'nin' && !nin.length) {
                return 'Countries list cannot be empty'
              }
            }

            return null
          },
          advanced: {
            limitDailyAverageSpending: (value, { step }) =>
              step === 2 && typeof value !== 'boolean' ? 'Invalid value' : null
          }
        }
      },
      startsAt: (value, { step }) => {
        if (step === 2) {
          if (value.getTime() <= Date.now()) {
            return 'The start date cannot be set in the past'
          }
        }

        return null
      },
      endsAt: (value, { step }) => {
        if (step === 2) {
          if (value.getTime() <= Date.now()) {
            return 'The end date cannot be set in the past'
          }
        }

        return null
      },
      asapStartingDate: (value, { step }) =>
        step === 2 && typeof value !== 'boolean' ? 'Invalid value' : null,
      currency: (value, { step }) => step === 2 && isNotEmpty('Select currency')(value),
      budget: (value, { step }) => {
        if (step === 2) {
          if (!value || Number(value) === 0 || Number.isNaN(Number(value))) {
            return 'Enter campaign budget or a valid number'
          }

          const minAmount = isAdmin ? MIN_CAMPAIGN_BUDGET_VALUE_ADMIN : MIN_CAMPAIGN_BUDGET_VALUE

          if (Number(value) < minAmount) {
            return `Campaign budget cannot be lower than ${minAmount}`
          }
          if (validateBudget(BigInt(Number(value)), availableBalance, decimals)) {
            return 'Available balance is lower than the campaign budget'
          }
        }

        return null
      },
      cpmPricingBounds: {
        min: (value, { step, cpmPricingBounds: { max } }) => {
          if (step === 2) {
            if (Number(value) === 0 || Number.isNaN(Number(value)))
              return 'Enter CPM min value or a valid number'
            if (Number(value) <= 0) return 'CPM min should be greater than 0'
            if (Number(value) < MIN_CPM_VALUE)
              return `CPM min cannot be lower than ${MIN_CPM_VALUE}`
            if (max !== '' && Number(value) >= Number(max))
              return 'CPM min cannot be greater than CPM max'
          }

          return null
        },
        max: (value, { step, cpmPricingBounds: { min } }) => {
          if (step === 2) {
            if (Number(value) === 0 || Number.isNaN(Number(value)))
              return 'Enter CPM max value or a valid number'
            if (Number(value) <= 0) return 'CPM max should be greater than 0'
            if (min !== '' && Number(value) <= Number(min))
              return 'CPM max cannot be lower than CPM min'
          }

          return null
        }
      },
      title: (value, { step }) =>
        step === 2 &&
        hasLength({ min: 2, max: 100 }, 'Campaign name must contain at least 2 characters')(value)
    },
    transformValues: (values) => {
      const transformedValuesToCampaign: ReducedCampaign = {
        ...(values.id ? { id: values.id } : {}),
        type: values.type,
        outpaceAssetAddr: values.outpaceAssetAddr,
        outpaceAssetDecimals: values.outpaceAssetDecimals,
        outpaceAddr: values.outpaceAddr,
        campaignBudget: parseToBigNumPrecision(
          Math.floor(Number(BigInt(Number(values.budget)))),
          decimals
        ),
        outpaceChainId: values.outpaceChainId,
        nonce: values.nonce,
        title: values.title,
        adUnits: values.adUnits,
        pricingBounds: {
          ...values.pricingBounds,
          IMPRESSION: {
            min: parseToBigNumPrecision(Number(values.cpmPricingBounds.min) / 1000, decimals),
            max: parseToBigNumPrecision(Number(values.cpmPricingBounds.max) / 1000, decimals)
          }
        },
        activeFrom: values.asapStartingDate
          ? BigInt(Date.now())
          : BigInt(values.startsAt.getTime()),
        activeTo: BigInt(values.endsAt.getTime()),
        targetingInput: values.targetingInput
      }

      return transformedValuesToCampaign
    }
  })

  const campaign = useMemo(() => form.getValues(), [form])
  const { getInputProps, key, errors } = form

  const [selectedBannerSizes, setSelectedBannerSizes] = useState<
    SupplyStatsDetails[] | SupplyStatsDetails[][]
  >([])
  const [selectedBidFloors, setSelectedBidFloors] = useState<
    SupplyStatsDetails[] | SupplyStatsDetails[][]
  >([])

  const updateCampaign = useCallback(
    (value: Partial<CampaignUI>) => {
      form.setValues((prev) => ({
        ...prev,
        dirty: true,
        ...value
      }))
    },
    [form]
  )

  const updateCampaignField = useCallback(
    (field: string, value: any) => form.setFieldValue(field, value),
    [form]
  )

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
        updateCampaign(parsedCampaign)
      }
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    updateSupplyStats()
  }, []) // eslint-disable-line

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem('createCampaign', superjson.stringify(form.getValues()))
      return undefined
    }

    return () => {
      window.onbeforeunload = null
    }
  }, []) // eslint-disable-line

  const addAdUnit = useCallback(
    (adUnitToAdd: AdUnit) => {
      form.insertListItem('adUnits', adUnitToAdd)
    },
    [form]
  )

  const removeAdUnit = useCallback(
    (index: number) => {
      form.removeListItem('adUnits', index)
    },
    [form]
  )

  const addUTMToTargetURLS = useCallback(() => {
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
    } = { ...campaign }

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

    updateCampaign({ adUnits })
  }, [updateCampaign, campaign])

  const resetCampaign = useCallback(() => {
    form.resetTouched()
    form.resetDirty()
    form.reset()
    const toSetReset = {
      ...defaultValue,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + WEEK),
      dirty: false
    }
    updateCampaign(toSetReset)
    // Do we need this???
    localStorage.setItem('createCampaign', superjson.stringify(toSetReset))
  }, [form, defaultValue, updateCampaign])

  const publishCampaign = useCallback(() => {
    const preparedCampaign = form.getTransformedValues()

    return adexServicesRequest('backend', {
      route: '/dsp/campaigns',
      method: 'POST',
      body: preparedCampaign,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }, [form, adexServicesRequest])

  const saveToDraftCampaign = useCallback(async () => {
    const preparedCampaign = form.getTransformedValues()

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
  }, [adexServicesRequest, form])

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
        budget: parseFromBigNumPrecision(
          BigInt(Math.floor(Number(draftCampaign.campaignBudget))),
          draftCampaign.outpaceAssetDecimals
        ).toString(),
        dirty: false
      }

      updateCampaign(mappedDraftCampaign)
    },
    [balanceToken.name, updateCampaign]
  )

  const contextValue = useMemo(
    () => ({
      campaign,
      updateCampaign,
      publishCampaign,
      resetCampaign,
      addAdUnit,
      removeAdUnit,
      selectedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors,
      form,
      updateCampaignField,
      getInputProps,
      key,
      errors
    }),
    [
      campaign,
      updateCampaign,
      publishCampaign,
      resetCampaign,
      addAdUnit,
      removeAdUnit,
      selectedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors,
      form,
      updateCampaignField,
      getInputProps,
      key,
      errors
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
