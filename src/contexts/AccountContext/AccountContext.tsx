import { createContext, FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react'
import { IAdExAccount } from 'types'
import { useLocalStorage } from '@mantine/hooks'
import { getMessageToSign, isTokenExpired, refreshAccessToken, verifyLogin } from 'lib/backend'
import { AmbireLoginSDK } from '@ambire/login-sdk-core'
import { DAPP_ICON_PATH, DAPP_NAME, DEFAULT_CHAIN_ID } from 'constants/login'
import useCustomNotifications from 'hooks/useCustomNotifications'

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: DAPP_NAME,
  dappIconPath: DAPP_ICON_PATH
})

interface IAccountContext {
  adexAccount: IAdExAccount | null
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  connectWallet: () => void
  disconnectWallet: () => void
  updateAdexAccount: (value: any) => void
  updateAccessToken: () => Promise<any>
  resetAdexAccount: () => void
}

const AccountContext = createContext<IAccountContext | null>(null)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showDangerNotification } = useCustomNotifications()
  const ambireSDK = useMemo(() => ambireLoginSDK, [])
  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: {
      address: '',
      chainId: 0,
      accessToken: '',
      refreshToken: '',
      authenticated: false,
      authMsgResp: null
    }
  })

  const updateAdexAccount = useCallback(
    (newValue: any | null) =>
      setAdexAccount((prevState) => (newValue === null ? newValue : { ...prevState, ...newValue })),
    [setAdexAccount]
  )
  const resetAdexAccount = useCallback(() => updateAdexAccount(null), [updateAdexAccount])

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
    if (!adexAccount?.accessToken || !adexAccount?.refreshToken) return
    if (isTokenExpired(adexAccount.accessToken)) {
      try {
        const response = await refreshAccessToken(adexAccount?.refreshToken)
        if (response) {
          updateAdexAccount({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          })
          return response
        }
        return null
      } catch (error: any) {
        console.error('Updating access token failed:', error)
        showDangerNotification(error, 'Updating access token failed')
        throw error
      }
    }
  }, [
    adexAccount?.accessToken,
    adexAccount?.refreshToken,
    updateAdexAccount,
    showDangerNotification
  ])

  const handleRegistrationOrLoginSuccess = useCallback(
    ({ address, chainId }: any) => {
      if (
        !address ||
        !chainId ||
        (adexAccount?.address !== '' &&
          adexAccount?.chainId !== 0 &&
          adexAccount?.authMsgResp !== null)
      )
        return

      const updatedAccount = { address, chainId }
      getMessageToSign(updatedAccount)
        .then((getMessage) => {
          updateAdexAccount({ ...updatedAccount, authMsgResp: getMessage.authMsg })
        })
        .catch((error) => {
          console.error('Get message to sign failed', error)
          showDangerNotification(error.message, 'Get message to sign failed')
        })
    },
    [
      adexAccount?.address,
      adexAccount?.chainId,
      adexAccount?.authMsgResp,
      updateAdexAccount,
      showDangerNotification
    ]
  )

  const handleMsgSigned = useCallback(
    ({ signature }: any) => {
      if (!signature || !adexAccount?.authMsgResp || adexAccount?.authenticated) return

      const body = {
        authMsg: { ...adexAccount?.authMsgResp },
        signature
      }

      verifyLogin(body)
        .then((authResp) => {
          if (!authResp) return
          updateAdexAccount({
            accessToken: authResp.accessToken,
            refreshToken: authResp.refreshToken,
            authenticated: !!authResp.accessToken && !!authResp.refreshToken
          })
        })
        .catch((error) => {
          console.error('Error verify login:', error)
          showDangerNotification(error.message, 'Verify login failed')
        })
    },
    [
      adexAccount?.authMsgResp,
      adexAccount?.authenticated,
      updateAdexAccount,
      showDangerNotification
    ]
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
    if (adexAccount?.authMsgResp && !adexAccount?.authenticated) {
      signMessage('eth_signTypedData', JSON.stringify(adexAccount.authMsgResp))
    }
  }, [adexAccount?.authMsgResp, adexAccount?.authenticated, signMessage])

  const authenticated = useMemo(
    () => Boolean(adexAccount?.authenticated),
    [adexAccount?.authenticated]
  )

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      // authenticated: true,
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
