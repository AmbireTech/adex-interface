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
import { CampaignUI, CreateCampaignType, SupplyStatsDetails, Devices } from 'types'
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
import { formatDateTime } from 'helpers'
import { isValidHttpUrl } from 'helpers/validators'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { useForm } from '@mantine/form'

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
      startsAt: isPastDateTime(CREATE_CAMPAIGN_DEFAULT_VALUE.startsAt)
        ? dayjs().add(1, 'minute').toDate()
        : CREATE_CAMPAIGN_DEFAULT_VALUE.startsAt
    }),
    [adexAccount?.address, balanceToken?.address, balanceToken?.decimals, balanceToken?.chainId]
  )
  const form = useForm({
    // mode: 'uncontrolled',
    initialValues: defaultValue,
    validateInputOnBlur: true,
    validate: {
      adUnits: {
        banner: {
          targetUrl: (value) => (!isValidHttpUrl(value) ? 'Please enter a valid URL' : null)
        }
      }
    }
  })
  // TODO: remove completely campaign useState
  const [c, setCampaign] = useState<CampaignUI>(defaultValue)
  console.log('c', c)
  const campaign = useMemo(() => form.getValues(), [form])

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
        // setCampaign(parsedCampaign)
        form.setValues(parsedCampaign)
      }
    }
  }, []) // eslint-disable-line

  useEffect(() => {
    updateSupplyStats()
  }, []) // eslint-disable-line

  useEffect(() => {
    window.onbeforeunload = () => {
      localStorage.setItem('createCampaign', superjson.stringify(form.getValues()))
      // setCampaign((prev) => {
      //   localStorage.setItem('createCampaign', superjson.stringify(prev))
      //   return prev
      // })
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
    (adUnitIdToRemove: string) => {
      const { adUnits } = { ...campaign }
      form.setValues({ adUnits: adUnits.filter((item: AdUnit) => item.id !== adUnitIdToRemove) })
    },
    [form, campaign]
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

    form.setValues({ adUnits })
  }, [form, campaign])
  // TODO: remove updatePartOfCampaign it can be used only updateCampaign func
  const updatePartOfCampaign = useCallback(
    (value: Partial<CampaignUI>) => {
      form.setValues(value)
    },
    [form]
  )

  const updateCampaign = useCallback(
    <CampaignItemKey extends keyof CampaignUI>(
      key: CampaignItemKey,
      value: CampaignUI[CampaignItemKey]
    ) => {
      form.setValues({ [key]: value, draftModified: true })
    },
    [form]
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
      selectedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors,
      form
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
      selectedBannerSizes,
      saveToDraftCampaign,
      updateCampaignFromDraft,
      defaultValue,
      addUTMToTargetURLS,
      selectedBidFloors,
      form
    ]
  )

  return (
    <CreateCampaignContext.Provider value={contextValue}>{children}</CreateCampaignContext.Provider>
  )
}

export { CreateCampaignContextProvider, CreateCampaignContext }
