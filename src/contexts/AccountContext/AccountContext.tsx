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
}

const AccountContext = createContext<IAccountContext | null>(null)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const { showDangerNotification, showInfoNotification } = useCustomNotifications()
  const ambireSDK = useMemo(() => ambireLoginSDK, [])
  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: {
      address: '',
      chainId: 1,
      accessToken: '',
      refreshToken: '',
      authenticated: false,
      authMsgResp: null
    }
  })

  const updateAdexAccount = useCallback(
    (newValue: any | null) => {
      setAdexAccount((prevState) => (newValue === null ? newValue : { ...prevState, ...newValue }))
    },
    [setAdexAccount]
  )

  const connectWallet = useCallback(() => {
    ambireSDK.openLogin({ chainId: DEFAULT_CHAIN_ID })
  }, [ambireSDK])

  const disconnectWallet = useCallback(() => {
    ambireSDK.openLogout()
  }, [ambireSDK])

  const signMessage = useCallback(
    (type: string, message: string) => {
      ambireSDK.openSignMessage(type, message)
    },
    [ambireSDK]
  )

  const updateAccessToken = useCallback(async () => {
    console.count('updateAccessToken')
    if (!adexAccount) return
    if (isTokenExpired(adexAccount)) {
      try {
        const response = await refreshAccessToken(adexAccount)
        if (response) {
          updateAdexAccount({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          })
          return response
        }
        return null
      } catch (error) {
        console.error('Error updating access token:', error)
        // Handle error gracefully, e.g., display an error message or retry later.
        throw error
      }
    }
  }, [adexAccount, updateAdexAccount])

  const handleLoginSuccess = useCallback(
    (data: any) => {
      console.count('handleLoginSuccess')
      if (!data) return
      const updatedAccount = { address: data.address, chainId: data.chainId }
      getMessageToSign(updatedAccount)
        .then((getMessage) => {
          updateAdexAccount({ ...updatedAccount, authMsgResp: getMessage.authMsg })
        })
        .catch((e) => {
          console.log('error', e)
          // ambireSDK.openLogout()
          showDangerNotification(e.message, 'Get message to sign failed')
        })
    },
    [updateAdexAccount, showDangerNotification]
  )

  const handleMsgSigned = useCallback(
    ({ signature }: any) => {
      console.count('handleMsgSigned')
      if (!adexAccount?.authMsgResp) return

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
        .catch((e) => {
          console.error('Error verifying login:', e)
          showDangerNotification(e.message, 'Verifying login failed')
          // ambireSDK.openLogout()
        })
    },
    [adexAccount?.authMsgResp, updateAdexAccount, showDangerNotification]
  )

  const handleMsgRejected = useCallback(() => {
    console.count('handleMsgRejected')
    disconnectWallet()
  }, [disconnectWallet])

  const handleLogoutSuccess = useCallback(() => {
    console.count('handleLogoutSuccess')
    ambireSDK.hideIframe()
    showInfoNotification('Successfully disconnected', 'Login SDK')
  }, [ambireSDK, showInfoNotification])

  const handleActionRejected = useCallback(() => {
    console.log('handleActionRejected')
    ambireSDK.openLogout()
  }, [ambireSDK])

  useEffect(() => {
    ambireSDK.onLoginSuccess(handleLoginSuccess)
    ambireSDK.onMsgSigned(handleMsgSigned)
    ambireSDK.onMsgRejected(handleMsgRejected)
    ambireSDK.onLogoutSuccess(handleLogoutSuccess)
    ambireSDK.onActionRejected(handleActionRejected)

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess)
      window.removeEventListener('msgSigned', handleMsgSigned)
      window.removeEventListener('msgRejected', handleMsgRejected)
      window.removeEventListener('logoutSuccess', handleLogoutSuccess)
      window.removeEventListener('actionRejected', handleActionRejected)
    }
  }, [
    ambireSDK,
    handleLoginSuccess,
    handleMsgSigned,
    handleMsgRejected,
    handleLogoutSuccess,
    handleActionRejected
  ])

  useEffect(() => {
    // TODO: Add more checks to prevent useless opening of the Sign Message
    if (adexAccount?.authMsgResp) {
      console.log('openSignMessage')
      signMessage('eth_signTypedData', JSON.stringify(adexAccount.authMsgResp))
    }
  }, [adexAccount?.authMsgResp, signMessage])

  // useEffect(() => {
  //   ambireSDK.onAlreadyLoggedIn(() => {
  //     console.log('onAlreadyLoggedIn')
  //     // if (!adexAccount?.authenticated) {
  //     //   ambireSDK.openLogout()
  //     // }
  //   })
  // }, [ambireSDK, adexAccount])

  const authenticated = useMemo(
    () => (!adexAccount ? false : adexAccount.authenticated),
    [adexAccount]
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
      updateAccessToken
    }),
    [
      adexAccount,
      authenticated,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAdexAccount,
      updateAccessToken
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
