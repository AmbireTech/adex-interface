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
  // deepEqual,
  hasUtmCampaign,
  selectBannerSizes
} from 'helpers/createCampaignHelpers'
import {
  parseBigNumTokenAmountToDecimal,
  parseFromBigNumPrecision,
  parseToBigNumPrecision
} from 'helpers/balances'
import { AdUnit, Campaign, Placement } from 'adex-common'
import { formatDateTime, MINUTE, WEEK } from 'helpers'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { hasLength, isNotEmpty, useForm } from '@mantine/form'
import useCustomNotifications from 'hooks/useCustomNotifications'

import { defaultConfirmModalProps } from 'components/common/Modals/CustomConfirmModal'
import { modals } from '@mantine/modals'

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
const LS_KEY_CREATE_CAMPAIGN = 'createCampaign'
const LS_KEY_CREATE_CAMPAIGN_STEP = 'createCampaignStep'

const isValidHttpUrl = (inputURL: string) => {
  try {
    const url = new URL(inputURL)

    return (
      ['http:', 'https:'].includes(url.protocol) &&
      (inputURL.startsWith('http://') || inputURL.startsWith('https://'))
    )
  } catch (_) {
    return false
  }
}

const validateBudget = (value: number, availableBalance: bigint, decimals: number) => {
  const parsedBalance = Number(parseBigNumTokenAmountToDecimal(availableBalance, decimals))
  return parsedBalance < value
}

const CreateCampaignContext = createContext<CreateCampaignType | null>(null)

const CreateCampaignContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
  const { supplyStats, updateSupplyStats } = useCampaignsData()
  const { showNotification } = useCustomNotifications()
  const [step, setStep] = useState(0)
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
      startsAt: new Date(Date.now() + MINUTE * 10),
      endsAt: new Date(Date.now() + WEEK)
    }),
    [adexAccount?.address, balanceToken?.address, balanceToken?.decimals, balanceToken?.chainId]
  )

  const [allowedBannerSizes, setAllowedBannerSizes] = useState<string[]>([])

  const [selectedBidFloors, setSelectedBidFloors] = useState<
    SupplyStatsDetails[] | SupplyStatsDetails[][]
  >([])

  const form = useForm({
    initialValues: defaultValue,
    validateInputOnBlur: true,
    validate: {
      adUnits: {
        banner: {
          format: (value) => {
            if (step === 0) {
              const format = `${value?.w}x${value?.h}`
              return !allowedBannerSizes.some((x) => x === format)
                ? `The banner size (${format}) does not meet the requirements.`
                : undefined
            }
          },
          targetUrl: (value, { adUnits }) => {
            console.log({ adUnits })
            if (step === 0 && !isValidHttpUrl(value)) {
              return 'Please enter a valid URL (https://...)'
            }
          }
        }
      },
      devices: (value, values) => {
        if (
          step === 0 &&
          values.targetingInput.inputs.placements.in.includes('site') &&
          !value.length
        ) {
          return 'Device/s not selected'
        }
      },
      targetingInput: {
        inputs: {
          placements: ({ in: isin }, values) => {
            if (step === 0 && !isin.length) {
              return 'Placement not selected'
            }

            // NOTE: ugly temp hack to validate adUnits length other than internal nits validation
            if (step === 0 && !values.adUnits.length) {
              return 'Creatives not uploaded'
            }
          },
          categories: ({ apply, in: isin, nin }) => {
            if (step === 1) {
              if (apply === 'in' && !isin.length) {
                return 'Categories list cannot be empty'
              }
              if (apply === 'nin' && !nin.length) {
                return 'Categories list cannot be empty'
              }
            }
          },
          location: ({ apply, in: isin, nin }) => {
            if (step === 1) {
              if (apply === 'in' && !isin.length) {
                return 'Countries list cannot be empty'
              }
              if (apply === 'nin' && !nin.length) {
                return 'Countries list cannot be empty'
              }
            }
          },
          advanced: {
            limitDailyAverageSpending: (value) =>
              step === 2 && typeof value !== 'boolean' ? 'Invalid value' : undefined
          }
        }
      },
      startsAt: (value) => {
        if (step === 2) {
          if (value.getTime() <= Date.now()) {
            return 'The start date cannot be set in the past'
          }
        }
      },
      endsAt: (value) => {
        if (step === 2) {
          if (value.getTime() <= Date.now()) {
            return 'The end date cannot be set in the past'
          }
        }
      },
      asapStartingDate: (value) =>
        step === 2 && typeof value !== 'boolean' ? 'Invalid value' : undefined,
      currency: (value) => step === 2 && isNotEmpty('Select currency')(value),
      budget: (value) => {
        if (step === 2) {
          if (!value || value === 0 || Number.isNaN(value)) {
            return 'Enter campaign budget or a valid number'
          }

          const minAmount = isAdmin ? MIN_CAMPAIGN_BUDGET_VALUE_ADMIN : MIN_CAMPAIGN_BUDGET_VALUE

          if (value < minAmount) {
            return `Campaign budget cannot be lower than ${minAmount}`
          }
          if (validateBudget(value, availableBalance, decimals)) {
            return 'Available balance is lower than the campaign budget'
          }
        }
      },
      cpmPricingBounds: {
        min: (value, { cpmPricingBounds: { max } }) => {
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
        max: (value, { cpmPricingBounds: { min } }) => {
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
      title: (value) =>
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

  useEffect(() => {
    window.onbeforeunload = () => {
      if (form.isDirty()) {
        localStorage.setItem(LS_KEY_CREATE_CAMPAIGN, superjson.stringify(form.getValues()))
        step > 0 && localStorage.setItem(LS_KEY_CREATE_CAMPAIGN_STEP, JSON.stringify(step))
      }
      return undefined
    }

    return () => {
      window.onbeforeunload = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    const savedCampaign = localStorage.getItem(LS_KEY_CREATE_CAMPAIGN)
    const savedStep = localStorage.getItem(LS_KEY_CREATE_CAMPAIGN_STEP)
    if (savedCampaign) {
      const parsedCampaign = superjson.parse<CampaignUI>(savedCampaign)
      if (parsedCampaign) {
        form.setValues(parsedCampaign)
        form.resetDirty()
        savedStep && setStep(JSON.parse(savedStep))
      }
    }
  }, []) // eslint-disable-line

  const campaign = useMemo(() => form.getValues(), [form])

  useEffect(() => {
    updateSupplyStats()
  }, []) // eslint-disable-line

  useEffect(() => {
    const placement = campaign.targetingInput.inputs.placements.in[0]
    const devices = campaign.devices
    const mappedSupplyStats: Record<string, SupplyStatsDetails[][]> = selectBannerSizes(supplyStats)
    const selectedPlatforms: Placement | Devices[] = placement === 'app' ? placement : devices
    if (Array.isArray(selectedPlatforms)) {
      const result = selectedPlatforms.map((platform) => mappedSupplyStats[platform][0])
      setAllowedBannerSizes(result.flat().map((x) => x.value))
      setSelectedBidFloors(selectedPlatforms.map((platform) => mappedSupplyStats[platform][1]))
    } else {
      setAllowedBannerSizes(
        (selectedPlatforms ? mappedSupplyStats[selectedPlatforms][0] : []).map((x) => x.value)
      )
      setSelectedBidFloors(selectedPlatforms ? mappedSupplyStats[selectedPlatforms][1] : [])
    }
  }, [campaign.devices, campaign.targetingInput.inputs.placements.in, supplyStats])

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
      const updatedUnits = [...adUnits].map((unit) => {
        const currentUrl = unit.banner?.targetUrl.trim() || ''
        if (!unit?.banner || !isValidHttpUrl(currentUrl)) {
          return unit
        }

        const targetUrl = addUrlUtmTracking({
          targetUrl: currentUrl,
          campaign: title,
          content: `${unit.banner.format.w}x${unit.banner.format.h}`,
          term: placement === 'app' ? 'App' : 'Website'
        })

        const withUtms: AdUnit = {
          ...unit,
          banner: {
            ...unit.banner,
            targetUrl
          }
        }

        return withUtms
      })

      form.setFieldValue('adUnits', updatedUnits)
    }
  }, [campaign, form])

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
      const res = await adexServicesRequest<{ success?: boolean; campaign: { id: string } }>(
        'backend',
        {
          route: '/dsp/campaigns/draft',
          method: 'POST',
          body: preparedCampaign,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!res?.success || !res?.campaign.id) {
        throw new Error('Error on saving draft campaign')
      }
      form.resetDirty()
      form.setFieldValue('id', res?.campaign.id)
      showNotification('info', 'Draft saved')
    } catch (err) {
      showNotification('error', 'Creating campaign failed', 'Data error')
      throw new Error('Error on saving draft campaign')
    }
  }, [adexServicesRequest, form, showNotification])

  const updateCampaignFromDraft = useCallback(
    (draftCampaign: Campaign, isClone?: boolean) => {
      const mappedDraftCampaign: CampaignUI = {
        ...draftCampaign,
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
        )
      }

      form.setValues(mappedDraftCampaign)
      !isClone && form.resetDirty()
    },
    [balanceToken.name, form]
  )

  const nextStep = useCallback(
    () =>
      setStep((current) => {
        if (form.validate().hasErrors) {
          return current
        }

        if (current === 2 && form.getValues().autoUTMChecked) {
          addUTMToTargetURLS()
        }
        return current < 4 ? current + 1 : current
      }),
    [addUTMToTargetURLS, form]
  )

  const prevStep = useCallback(
    () => setStep((current) => (current > 0 ? current - 1 : current)),
    []
  )

  const resetCampaign = useCallback(
    (reasonMsg?: string, onReset?: () => void) => {
      const reset = () => {
        form.reset()
        form.setValues({
          startsAt: new Date(Date.now() + MINUTE * 10),
          endsAt: new Date(Date.now() + WEEK)
        })
        setStep(0)
        localStorage.removeItem(LS_KEY_CREATE_CAMPAIGN)
        localStorage.removeItem(LS_KEY_CREATE_CAMPAIGN_STEP)
        onReset && onReset()
      }
      if (form.isDirty()) {
        modals.openConfirmModal(
          defaultConfirmModalProps({
            text: 'You have unsaved changes. Do you want to save them as a draft?',
            color: 'attention',
            labels: { confirm: reasonMsg || 'Continue without saving', cancel: 'Save draft' },
            onConfirm: () => {
              reset()
            },
            onCancel: () => {
              saveToDraftCampaign()
              reset()
            }
          })
        )
      } else {
        reset()
      }

      // TODO: see why default values keep adUnits
      // NOTE: looks like addUTMToTargetURLS was bugging it but maybe there is other issues
      // Works as expected now  without setting initial vales, just reset()
    },
    [form, saveToDraftCampaign]
  )

  const contextValue = useMemo(
    () => ({
      campaign,
      publishCampaign,
      resetCampaign,
      allowedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors,
      form,
      step,
      nextStep,
      prevStep
    }),
    [
      campaign,
      publishCampaign,
      resetCampaign,
      allowedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors,
      form,
      step,
      nextStep,
      prevStep
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
