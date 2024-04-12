import { useLocalStorage } from '@mantine/hooks'
import { createContext, FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react'
import { Account, IAdExAccount } from 'types'
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

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: DAPP_NAME,
  dappIconPath: DAPP_ICON_PATH
})

interface IAccountContext {
  adexAccount: IAdExAccount & Account & { loaded: boolean; initialLoad: boolean }
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  isAdmin: boolean
  connectWallet: () => void
  disconnectWallet: () => void
  updateAdexAccount: (value: any) => void
  updateAccessToken: () => Promise<any>
  resetAdexAccount: () => void
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
  availableBalance: BigInt(0),
  balanceToken: {
    name: '',
    address: '',
    decimals: 0,
    chainId: 0
  },
  fundsDeposited: {
    total: BigInt(0),
    deposits: []
  },
  fundsOnCampaigns: {
    total: BigInt(0),
    perCampaign: []
  },
  refundsFromCampaigns: {
    total: BigInt(0),
    perCampaign: []
  },
  created: new Date(),
  updated: new Date()
}

function serializeJSON<T>(value: T) {
  try {
    return JSON.stringify(value)
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
        : { ...deserializeJSON(str), loaded: true }

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
    () => updateAdexAccount({ ...defaultValue, initialLoad: true }),
    [updateAdexAccount]
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

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      // authenticated: true,
      isAdmin,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAdexAccount,
      updateAccessToken,
      resetAdexAccount
    }),
    [
      adexAccount,
      authenticated,
      isAdmin,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAdexAccount,
      updateAccessToken,
      resetAdexAccount
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
