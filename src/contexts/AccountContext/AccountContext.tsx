import { useLocalStorage } from '@mantine/hooks'
import { createContext, FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react'
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

const processResponse = (res: any) => {
  // console.log('res', res)
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('unauthorized', text)
    }

    const err = getReqErr(res, text)
    throw new Error(err)
  })
}

type AdExService = 'backend' | 'validator'

type ApiRequestOptions<T> = Omit<RequestOptions<T>, 'url'> & {
  route: string
  noAuth?: boolean
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
    companyNumber: 1,
    companyNumberPrim: 2,
    companyAddress: '',
    companyCountry: '',
    companyCity: '',
    companyZipCode: 0
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
      const ser = serializeJSON({ ...acc, loaded: true })
      // console.log({ ser })

      return ser
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

  const updateAdexAccount = useCallback(
    (newValue: IAccountContext['adexAccount']) =>
      setAdexAccount((prevState) => ({ ...prevState, ...newValue, loaded: true })),
    [setAdexAccount]
  )
  const resetAdexAccount = useCallback(
    () => setAdexAccount({ ...defaultValue, initialLoad: true }),
    [setAdexAccount]
  )

  const connectWallet = useCallback(
    () => ambireSDK.openLogin({ chainId: DEFAULT_CHAIN_ID }),
    [ambireSDK]
  )
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
          updateAdexAccount({
            ...adexAccount,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
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
  }, [adexAccount, updateAdexAccount, showNotification, resetAdexAccount])

  const handleRegistrationOrLoginSuccess = useCallback(
    ({ address, chainId }: any) => {
      if (
        !address ||
        !chainId ||
        (adexAccount.address !== '' &&
          adexAccount.chainId !== 0 &&
          adexAccount.authMsgResp !== null)
      )
        return

      const updatedAccount = { address, chainId }
      getMessageToSign(updatedAccount)
        .then((getMessage) => {
          updateAdexAccount({ ...adexAccount, ...updatedAccount, authMsgResp: getMessage.authMsg })
        })
        .catch((error) => {
          console.error('Get message to sign failed', error)
          showNotification('error', error?.message, 'Get message to sign failed')
        })
    },
    [adexAccount, updateAdexAccount, showNotification]
  )

  const handleMsgSigned = useCallback(
    ({ signature }: any) => {
      if (!signature || !adexAccount.authMsgResp || adexAccount.authenticated) return

      const body = {
        authMsg: { ...adexAccount.authMsgResp },
        signature
      }

      verifyLogin(body)
        .then((authResp) => {
          if (!authResp) return
          updateAdexAccount({
            ...adexAccount,
            accessToken: authResp.accessToken,
            refreshToken: authResp.refreshToken,
            authenticated: !!authResp.accessToken && !!authResp.refreshToken
          })
        })
        .catch((error) => {
          console.error('Error verify login:', error)
          showNotification('error', error?.message, 'Verify login failed')
        })
    },
    [adexAccount, updateAdexAccount, showNotification]
  )

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
    ambireSDK.onLoginSuccess(handleRegistrationOrLoginSuccess)
    ambireSDK.onAlreadyLoggedIn(handleRegistrationOrLoginSuccess)
    ambireSDK.onMsgSigned(handleMsgSigned)
    ambireSDK.onMsgRejected(handleMsgRejected)
    ambireSDK.onLogoutSuccess(handleLogoutSuccess)
    ambireSDK.onActionRejected(handleActionRejected)
  }, [
    ambireSDK,
    handleRegistrationOrLoginSuccess,
    handleMsgSigned,
    handleMsgRejected,
    handleLogoutSuccess,
    handleActionRejected
  ])

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
        .catch((err) => showNotification('error', err.message, 'Data error'))
    },
    [adexAccount.accessToken, showNotification, updateAccessToken]
  )

  const updateBalance = useCallback(async () => {
    try {
      const getBalance = await adexServicesRequest<Account>('backend', {
        route: '/dsp/accounts/my-account',
        method: 'GET'
      })

      console.log({ getBalance })

      if (getBalance) {
        updateAdexAccount({ ...adexAccount, ...getBalance })
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
  }, [adexAccount, adexServicesRequest, showNotification, updateAdexAccount])

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
          updateAdexAccount({ ...adexAccount, billingDetails })
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
        showNotification('error', err, 'Updating billing details failed')
      }
    },
    [adexServicesRequest, showNotification, updateAdexAccount, adexAccount]
  )

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
      updateBillingDetails
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
      updateBillingDetails
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
