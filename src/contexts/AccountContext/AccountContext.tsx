import { useLocalStorage } from '@mantine/hooks'
import {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react'
import { Account, BillingDetails, IAdExAccount } from 'types'
import {
  getMessageToSign,
  isAdminToken,
  isTokenExpired,
  refreshAccessToken,
  verifyLogin
} from 'lib/backend'
import { AmbireLoginSDK } from '@ambire/login-sdk-core'
import { DAPP_ICON_PATH, DAPP_NAME, DEFAULT_CHAIN_ID } from 'constants/login'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { fetchService, getReqErr, RequestOptions } from 'services'

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: DAPP_NAME,
  dappIconPath: DAPP_ICON_PATH
})

export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL
export const VALIDATOR_BASE_URL = process.env.REACT_APP_VALIDATOR_BASE_URL
const UNAUTHORIZED_ERR_STR = 'Unauthorized!'

console.log({ BACKEND_BASE_URL })
const processResponse = (res: any) => {
  // console.log('res', res)
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error(`${UNAUTHORIZED_ERR_STR}: `, text)
    }

    const err = getReqErr(res, text)
    throw new Error(err)
  })
}

type AdExService = 'backend' | 'validator'

type ApiRequestOptions<T> = Omit<RequestOptions<T>, 'url'> & {
  route: string
  noAuth?: boolean
  onErrMsg?: string
}

interface IAccountContext {
  adexAccount: IAdExAccount & Account & { loaded: boolean; initialLoad: boolean }
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  isAdmin: boolean
  connectWallet: () => void
  disconnectWallet: () => void
  updateAccessToken: () => Promise<any>
  resetAdexAccount: () => void
  adexServicesRequest: <T extends any>(
    service: AdExService,
    reqOptions: ApiRequestOptions<T>
  ) => Promise<T>
  updateBalance: () => Promise<void>
  updateBillingDetails: (billingDetails: BillingDetails) => Promise<void>
  isLoading: boolean
}

const AccountContext = createContext<IAccountContext | null>(null)

const defaultValue: IAccountContext['adexAccount'] = {
  address: 'default',
  chainId: 0,
  accessToken: null,
  refreshToken: null,
  authenticated: false,
  authMsgResp: null,
  loaded: false,
  // This ensures there is some obj in the ls
  initialLoad: false,
  id: '',
  name: '',
  active: false,
  availableBalance: 0n,
  balanceToken: {
    name: '',
    address: '',
    decimals: 0,
    chainId: 0
  },
  fundsDeposited: {
    total: 0n,
    deposits: []
  },
  fundsOnCampaigns: {
    total: 0n,
    perCampaign: []
  },
  refundsFromCampaigns: {
    total: 0n,
    perCampaign: []
  },
  billingDetails: {
    firstName: '',
    lastName: '',
    companyName: '',
    companyNumber: '',
    companyNumberPrim: '',
    companyAddress: '',
    companyCountry: '',
    companyCity: '',
    companyZipCode: ''
  },
  created: new Date(),
  updated: new Date()
}

function serializeJSON<T>(v: T) {
  try {
    return JSON.stringify(
      v,
      (_, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
  } catch (error) {
    throw new Error('Failed to serialize the value')
  }
}

function deserializeJSON(value: string) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showNotification } = useCustomNotifications()
  const ambireSDK = useMemo(() => ambireLoginSDK, [])
  const [isLoading, setIsLoading] = useState(false)
  const [sdkMsgSignature, setSdkMsgSignature] = useState<string>('')
  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: { ...defaultValue },
    deserialize: (str) => {
      // console.log({ str })
      const res = !str
        ? { ...defaultValue, updated: true }
        : { ...defaultValue, ...deserializeJSON(str), loaded: true }

      // console.log({ res })

      return res
    },
    serialize: (acc) => {
      const seri = serializeJSON({ ...acc, loaded: true })
      // console.log({ ser })

      return seri
    }
  })

  // NOTE: hax to ensure there is storage value as there is no way to differentiate the default value from storage value using useLocalStorage
  useEffect(() => {
    const lsAcc = deserializeJSON(localStorage.getItem('adexAccount') || '')
    // console.log({ lsAcc })

    if (!lsAcc) {
      setAdexAccount({ ...defaultValue, initialLoad: true })
    }
  }, [setAdexAccount])

  const resetAdexAccount = useCallback(
    () => setAdexAccount({ ...defaultValue, initialLoad: true }),
    [setAdexAccount]
  )

  const connectWallet = useCallback(() => {
    console.log({ ambireSDK })
    ambireSDK.openLogin({ chainId: DEFAULT_CHAIN_ID })
  }, [ambireSDK])

  const disconnectWallet = useCallback(() => ambireSDK.openLogout(), [ambireSDK])

  const signMessage = useCallback(
    (type: string, message: string) => ambireSDK.openSignMessage(type, message),
    [ambireSDK]
  )

  const updateAccessToken = useCallback(async () => {
    if (!adexAccount.accessToken || !adexAccount.refreshToken) return

    if (isTokenExpired(adexAccount.refreshToken)) {
      resetAdexAccount()
      showNotification('error', 'Refresh token has been expired', 'Refresh token')
      return
    }

    if (isTokenExpired(adexAccount.accessToken)) {
      try {
        const response = await refreshAccessToken(adexAccount.refreshToken)
        if (response) {
          setAdexAccount((prev) => {
            const next = {
              ...prev,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            }

            return next
          })
          return response
        }
        return null
      } catch (error: any) {
        console.error('Updating access token failed:', error)
        showNotification('error', error?.message, 'Updating access token failed')
        throw error
      }
    }
  }, [
    adexAccount.accessToken,
    adexAccount.refreshToken,
    resetAdexAccount,
    showNotification,
    setAdexAccount
  ])

  const adexServicesRequest = useCallback(
    // Note
    async <T extends any>(service: AdExService, reqOptions: ApiRequestOptions<T>): Promise<T> => {
      // temp hax for using the same token fot validator auth
      const authHeaderProp = service === 'backend' ? 'X-DSP-AUTH' : 'authorization'

      // url check
      // TODO: route instead url in props
      const baseUrl = (service === 'backend' ? BACKEND_BASE_URL : VALIDATOR_BASE_URL) || ''
      const urlCheck = reqOptions.route.replace(baseUrl, '').replace(/^\//, '')

      const req: RequestOptions<T> = {
        url: `${baseUrl}/${urlCheck}`,
        method: reqOptions.method,
        body: reqOptions.body,
        queryParams: reqOptions.queryParams,
        headers: reqOptions.headers
      }

      // console.log('adexAccount', adexAccount)
      if (!adexAccount.accessToken) throw new Error('Access token is missing')

      const authHeader = {
        [authHeaderProp]: `Bearer ${adexAccount.accessToken}`
      }

      // TODO: log-out if no access token
      // TODO: fix updateAccessToken logic - it returns if there are no access token,
      // it should throw ot log-out
      // TODO: if using updateAccessToken triggers some circular updates - account context should be fixed
      const response = await updateAccessToken()

      if (response) {
        const updatedAccessToken = response.accessToken
        authHeader[authHeaderProp] = `Bearer ${updatedAccessToken}`
      }

      req.headers = {
        ...authHeader,
        ...req.headers
      }

      console.log('req', req)

      return fetchService(req)
        .then(processResponse)
        .catch((err) => {
          console.log(err)
          // TODO: better check
          if (err && err.message && err.message.includes(UNAUTHORIZED_ERR_STR)) {
            resetAdexAccount()
          }
          showNotification('error', err.message, reqOptions.onErrMsg || 'Data error')
        })
    },
    [adexAccount.accessToken, resetAdexAccount, showNotification, updateAccessToken]
  )

  const handleRegistrationOrLoginSuccess = useCallback(
    async ({ address, chainId }: any) => {
      if (!address || !chainId) {
        showNotification('warning', 'Ambire sdk no address or chain')
        return
      }

      // TODO: this need to be fixed because it can be called more than once
      // because it's triggered on more than oe event
      // This check works atm but it's not ok
      // if (prev.address !== '' && prev.chainId !== 0 && prev.authMsgResp !== null) {
      //   return prev
      // }

      try {
        console.log('getMessageToSign', { address, chainId })
        const authMsgRsp = await getMessageToSign({ address, chainId })

        setAdexAccount((prev) => {
          if (prev.address !== '' && prev.chainId !== 0 && prev.authMsgResp !== null) {
            return prev
          }

          const next = { ...prev, address, chainId, authMsgResp: authMsgRsp.authMsg }
          return next
        })
      } catch (error) {
        console.error('Get message to sign failed', error)
        showNotification('error', 'Get message to sign failed')
      }
    },
    [setAdexAccount, showNotification]
  )

  useEffect(() => {
    if (!sdkMsgSignature || !adexAccount.authMsgResp || adexAccount.authenticated) return

    async function verify() {
      try {
        // console.log('verifyLogin')
        const authResp = await verifyLogin({
          authMsg: { ...adexAccount.authMsgResp },
          signature: sdkMsgSignature
        })

        if (!authResp) {
          setIsLoading(false)
          throw new Error('Verify login failed')
        }

        setAdexAccount((prev) => {
          const { accessToken, refreshToken } = authResp
          const next = {
            ...prev,
            accessToken,
            refreshToken,
            authenticated: !!authResp.accessToken && !!authResp.refreshToken
          }

          return next
        })
        setIsLoading(false)
      } catch (error) {
        console.error('Error verify login:', error)
        showNotification('error', 'Verify login failed')
        setIsLoading(false)
      }
    }

    verify()
  }, [
    sdkMsgSignature,
    adexAccount.authMsgResp,
    adexAccount.authenticated,
    showNotification,
    setAdexAccount
  ])

  const handleMsgRejected = useCallback(() => {
    disconnectWallet()
  }, [disconnectWallet])

  const handleLogoutSuccess = useCallback(() => {
    resetAdexAccount()
  }, [resetAdexAccount])

  const handleActionRejected = useCallback(() => {
    disconnectWallet()
  }, [disconnectWallet])

  useEffect(() => {
    ambireSDK.onRegistrationSuccess(handleRegistrationOrLoginSuccess)
  }, [ambireSDK, handleRegistrationOrLoginSuccess])

  useEffect(() => {
    ambireSDK.onLoginSuccess(handleRegistrationOrLoginSuccess)
  }, [ambireSDK, handleRegistrationOrLoginSuccess])
  useEffect(() => {
    ambireSDK.onAlreadyLoggedIn(handleRegistrationOrLoginSuccess)
  }, [ambireSDK, handleRegistrationOrLoginSuccess])
  useEffect(() => {
    ambireSDK.onMsgSigned(({ signature }: any) =>
      setSdkMsgSignature(() => {
        setIsLoading(true)
        return signature
      })
    )
  }, [ambireSDK])

  useEffect(() => {
    ambireSDK.onMsgRejected(handleMsgRejected)
  }, [ambireSDK, handleMsgRejected])

  useEffect(() => {
    ambireSDK.onLogoutSuccess(handleLogoutSuccess)
  }, [ambireSDK, handleLogoutSuccess])

  useEffect(() => {
    ambireSDK.onActionRejected(handleActionRejected)
  }, [ambireSDK, handleActionRejected])

  useEffect(() => {
    if (adexAccount.authMsgResp && !adexAccount.authenticated) {
      signMessage('eth_signTypedData', JSON.stringify(adexAccount.authMsgResp))
    }
  }, [adexAccount.authMsgResp, adexAccount.authenticated, signMessage])

  const authenticated = useMemo(
    () => Boolean(adexAccount.authenticated),
    [adexAccount.authenticated]
  )

  const isAdmin = useMemo(
    () => Boolean(isAdminToken(adexAccount.accessToken)),
    [adexAccount.accessToken]
  )

  const updateBalance = useCallback(async () => {
    try {
      const accountData = await adexServicesRequest<Account>('backend', {
        route: '/dsp/accounts/my-account',
        method: 'GET'
      })

      console.log({ accountData })

      if (accountData) {
        setAdexAccount((prev) => {
          const next = { ...prev, ...accountData }
          return next
        })
      } else {
        showNotification(
          'error',
          'Updating account balance failed',
          'Updating account balance failed'
        )
      }
    } catch (err: any) {
      console.error('Updating account balance failed:', err)
      showNotification('error', err, 'Updating account balance failed')
    }
  }, [adexServicesRequest, setAdexAccount, showNotification])

  const updateBillingDetails = useCallback(
    async (billingDetails: BillingDetails) => {
      try {
        const updated = await adexServicesRequest<unknown>('backend', {
          route: '/dsp/accounts/billing-details',
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: billingDetails
        })

        if (updated) {
          setAdexAccount((prev) => {
            const next = { ...prev, billingDetails }
            return next
          })
          showNotification('info', 'Billing details updated', 'Successfully')
        } else {
          showNotification(
            'error',
            'Updating billing details failed',
            'Updating billing details failed'
          )
        }
      } catch (err: any) {
        console.error('Updating billing details failed:', err)
        showNotification('error', 'Updating billing details failed')
      }
    },
    [adexServicesRequest, setAdexAccount, showNotification]
  )

  useEffect(() => {
    if (adexAccount.authenticated) {
      console.log('adexAccount.authenticated')
      updateBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adexAccount.authenticated])

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      isAdmin,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAccessToken,
      resetAdexAccount,
      adexServicesRequest,
      updateBalance,
      updateBillingDetails,
      isLoading
    }),
    [
      adexAccount,
      authenticated,
      isAdmin,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAccessToken,
      resetAdexAccount,
      adexServicesRequest,
      updateBalance,
      updateBillingDetails,
      isLoading
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
