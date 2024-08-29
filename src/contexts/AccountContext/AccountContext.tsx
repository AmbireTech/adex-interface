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
import { isAdminToken, isTokenExpired } from 'lib/backend'
import { AmbireLoginSDK } from '@ambire/login-sdk-core'
import { DAPP_ICON_PATH, DAPP_NAME, DEFAULT_CHAIN_ID } from 'constants/login'
import useCustomNotifications from 'hooks/useCustomNotifications'
import { fetchService, getReqErr, RequestOptions } from 'services'
// import SuperJSON from 'superjson'

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: DAPP_NAME,
  dappIconPath: DAPP_ICON_PATH
})

export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL
export const VALIDATOR_BASE_URL = process.env.REACT_APP_VALIDATOR_BASE_URL
const UNAUTHORIZED_ERR_STR = 'Unauthorized'

console.log({ BACKEND_BASE_URL })
const processResponse = <R extends any>(res: Response): Promise<R> => {
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

type AuthMsgResp = {
  authMsg: {
    domain: {
      name: string
      chainId: any
    }
    types: {
      LoginInfo: {
        name: string
        type: string
      }[]
    }
    primaryType: string
    message: {
      wallet: string
      purpose: string
      requestedAt: Date
    }
  }
}

type AccessTokensResp = {
  accessToken: string
  refreshToken: string
}

type AdExService = 'backend' | 'validator'

type ApiRequestOptions = Omit<RequestOptions, 'url' | 'body'> & {
  route: string
  body?: BodyInit | object | string | FormData
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
  logOut: () => void
  adexServicesRequest: <R extends any>(
    service: AdExService,
    reqOptions: ApiRequestOptions
  ) => Promise<R>
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
  const [sdkMsgSignature, setSdkMsgSignature] = useState<string | null>(null)
  const [authMsg, setAuthMsg] = useState<AuthMsgResp | null>(null)
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
  const authenticated = useMemo(
    () => !!adexAccount.accessToken && !!adexAccount.refreshToken,
    [adexAccount.accessToken, adexAccount.refreshToken]
  )

  // NOTE: hax to ensure there is storage value as there is no way to differentiate the default value from storage value using useLocalStorage
  useEffect(() => {
    const lsAcc: IAccountContext['adexAccount'] = deserializeJSON(
      localStorage.getItem('adexAccount') || ''
    )
    console.log({ lsAcc })

    if (!lsAcc) {
      setAdexAccount({ ...defaultValue, initialLoad: true })
    }
  }, [setAdexAccount])

  const resetAdexAccount = useCallback(
    (reason?: string) => {
      console.log('reset account: ', reason)
      setAdexAccount({ ...defaultValue, initialLoad: true })
    },
    [setAdexAccount]
  )

  const connectWallet = useCallback(() => {
    console.log({ ambireSDK })
    resetAdexAccount('connecting new wallet')
    ambireSDK.openLogin({ chainId: DEFAULT_CHAIN_ID })
  }, [ambireSDK, resetAdexAccount])

  const disconnectWallet = useCallback(() => ambireSDK.openLogout(), [ambireSDK])

  const signMessage = useCallback(
    (type: string, message: string) => ambireSDK.openSignMessage(type, message),
    [ambireSDK]
  )

  const checkAndGetNewAccessTokens = useCallback(async (): Promise<{
    accessToken: string
    refreshToken: string
  } | null> => {
    if (!adexAccount.accessToken || !adexAccount.refreshToken) {
      throw new Error(`${UNAUTHORIZED_ERR_STR}: missing access tokens`)
    }

    if (isTokenExpired(adexAccount.accessToken, 100)) {
      console.log('updating access tokens')
      try {
        const req: RequestOptions = {
          url: `${BACKEND_BASE_URL}/dsp/refresh-token`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            refreshToken: adexAccount.refreshToken
          })
        }

        const res = await fetchService(req)
        return await processResponse<{ accessToken: string; refreshToken: string }>(res)
      } catch (error: any) {
        console.error('Updating access token failed:', error)
        showNotification('error', error?.message, 'Updating access token failed')
        throw new Error(`${UNAUTHORIZED_ERR_STR}: ${error}`)
      }
    } else if (isTokenExpired(adexAccount.refreshToken)) {
      resetAdexAccount('refresh token expired')
      showNotification('info', 'Please log in!', 'Session expired')
    }

    return null
  }, [adexAccount.accessToken, adexAccount.refreshToken, resetAdexAccount, showNotification])

  const adexServicesRequest = useCallback(
    // Note
    async <R extends any>(service: AdExService, reqOptions: ApiRequestOptions): Promise<R> => {
      try {
        // temp hax for using the same token fot validator auth
        const authHeaderProp = service === 'backend' ? 'X-DSP-AUTH' : 'authorization'

        // url check
        // TODO: route instead url in props
        const baseUrl = (service === 'backend' ? BACKEND_BASE_URL : VALIDATOR_BASE_URL) || ''
        const urlCheck = reqOptions.route.replace(baseUrl, '').replace(/^\//, '')

        const req: RequestOptions = {
          url: `${baseUrl}/${urlCheck}`,
          method: reqOptions.method,
          body:
            !(reqOptions.body instanceof FormData) && typeof reqOptions.body === 'object'
              ? serializeJSON(reqOptions.body)
              : reqOptions.body,
          queryParams: reqOptions.queryParams,
          headers: reqOptions.headers
        }

        // console.log('adexAccount', adexAccount)
        if (!adexAccount.accessToken) throw new Error('Access token is missing')

        const authHeader = {
          [authHeaderProp]: `Bearer ${adexAccount.accessToken}`
        }

        const newAccessTokens = await checkAndGetNewAccessTokens()

        if (newAccessTokens) {
          setAdexAccount((prev) => {
            return {
              ...prev,
              ...newAccessTokens
            }
          })
          authHeader[authHeaderProp] = `Bearer ${newAccessTokens.accessToken}`
        }

        req.headers = {
          ...authHeader,
          ...req.headers
        }

        const res = await fetchService(req)
        return await processResponse<R>(res)
      } catch (err: any) {
        if (service === 'backend' && err && (err?.message || err).includes(UNAUTHORIZED_ERR_STR)) {
          resetAdexAccount(UNAUTHORIZED_ERR_STR)
        }
        return Promise.reject<R>(err)
      }
    },
    [adexAccount.accessToken, checkAndGetNewAccessTokens, setAdexAccount, resetAdexAccount]
  )

  const logOut = useCallback(async () => {
    try {
      const resp = await adexServicesRequest<{}>('backend', {
        route: '/dsp/logout',
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: {
          refreshToken: adexAccount.refreshToken
        }
      })
      if (resp) {
        disconnectWallet()
        resetAdexAccount('Log out btn (backend)')
        showNotification('info', 'Successfully logged out', 'Logging out')
      }
    } catch (err: any) {
      console.error('logOut: ', err)
      showNotification('error', err?.message || err, 'Logging out failed')
    }
  }, [
    adexAccount.refreshToken,
    adexServicesRequest,
    disconnectWallet,
    resetAdexAccount,
    showNotification
  ])

  const getAuthMsg = useCallback(
    async ({ wallet, chainId }: { wallet: string; chainId: string }): Promise<AuthMsgResp> => {
      try {
        const req: RequestOptions = {
          url: `${BACKEND_BASE_URL}/dsp/login-msg`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            wallet,
            chainId
          })
        }

        const res = await fetchService(req)
        return await processResponse<AuthMsgResp>(res)
      } catch (err: any) {
        console.log(err)
        throw new Error(err)
      }
    },
    []
  )

  const verifyLoginMsg = useCallback(
    async (veryData: AuthMsgResp & { signature: string }): Promise<AccessTokensResp> => {
      try {
        const req: RequestOptions = {
          url: `${BACKEND_BASE_URL}/dsp/login-verify`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(veryData)
        }

        const res = await fetchService(req)
        return await processResponse<AccessTokensResp>(res)
      } catch (err: any) {
        console.log(err)
        throw new Error(err)
      }
    },
    []
  )

  const handleSDKAuthSuccess = useCallback(
    async ({ address, chainId }: any) => {
      if (!address || !chainId) {
        showNotification('warning', 'Ambire sdk no address or chain')
        return
      }

      console.log('handleSDKAuthSuccess')

      try {
        const authMsgResp = await getAuthMsg({ wallet: address, chainId })
        console.log({ authMsgResp })
        setAuthMsg(authMsgResp)
        signMessage('eth_signTypedData', JSON.stringify(authMsgResp.authMsg))
        setAdexAccount({ ...defaultValue, address, chainId })
      } catch (error) {
        console.error('Get message to sign failed', error)
        showNotification('error', 'Get message to sign failed')
      }
    },
    [getAuthMsg, setAdexAccount, showNotification, signMessage]
  )

  useEffect(() => {
    async function verify() {
      if (!sdkMsgSignature || !authMsg) return
      try {
        const authResp = await verifyLoginMsg({
          ...authMsg,
          signature: sdkMsgSignature
        })

        if (!authResp.accessToken || !authResp.refreshToken) {
          throw new Error('Verify login failed, invalid tokens response')
        }

        setAdexAccount((prev: IAccountContext['adexAccount']) => {
          const next: IAccountContext['adexAccount'] = {
            ...prev,
            ...authResp
          }
          return next
        })
      } catch (error: any) {
        console.error('Error verify login:', error)
        showNotification('error', 'Verify login failed', error?.message || error)
        setAdexAccount({
          ...defaultValue
        })
      } finally {
        setIsLoading(false)
        setSdkMsgSignature(null)
        setAuthMsg(null)
      }
    }

    verify()
  }, [sdkMsgSignature, showNotification, setAdexAccount, verifyLoginMsg, authMsg])

  const handleLogoutSuccess = useCallback(() => {
    resetAdexAccount('Log out SDK')
  }, [resetAdexAccount])

  const handleMsgRejected = useCallback((data: any) => {
    console.log('message rejected', data)
  }, [])

  const handleActionRejected = useCallback((data: any) => {
    console.log('action rejected', data)
  }, [])

  const handleTxnRejected = useCallback((data: any) => {
    console.log('action rejected', data)
  }, [])

  useEffect(() => {
    ambireSDK.onRegistrationSuccess(handleSDKAuthSuccess)
  }, [ambireSDK, handleSDKAuthSuccess])

  useEffect(() => {
    ambireSDK.onLoginSuccess(handleSDKAuthSuccess)
  }, [ambireSDK, handleSDKAuthSuccess])

  useEffect(() => {
    ambireSDK.onAlreadyLoggedIn(handleSDKAuthSuccess)
  }, [ambireSDK, handleSDKAuthSuccess])

  useEffect(() => {
    ambireSDK.onMsgSigned((data: { signature: string; type: string }) => {
      setIsLoading(true)
      setSdkMsgSignature(data.signature)
    })
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
    ambireSDK.onTxnRejected(handleTxnRejected)
  }, [ambireSDK, handleTxnRejected])

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
        const updated = await adexServicesRequest<{ success?: boolean }>('backend', {
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
    if (authenticated) {
      console.log('adexAccount.authenticated')
      updateBalance()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated])

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      isAdmin,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      adexServicesRequest,
      updateBalance,
      updateBillingDetails,
      isLoading,
      logOut
    }),
    [
      adexAccount,
      authenticated,
      isAdmin,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      adexServicesRequest,
      updateBalance,
      updateBillingDetails,
      isLoading,
      logOut
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
