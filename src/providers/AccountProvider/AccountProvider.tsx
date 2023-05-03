import { createContext, FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react'
import { IAdExAccount } from 'types'
import { useLocalStorage } from '@mantine/hooks'
// import { registerUser } from 'lib/backend'

import { AmbireLoginSDK } from '@ambire/login-sdk-core'

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: 'AdEx Platform',
  dappIconPath:
    'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/adex-logos/Ambire_AdEx_Symbol_color.svg'
})

// const testAccount: IAdExAccount = {
//   name: 'Gosho',
//   email: 'gosho@myyanko.com',
//   address: '0x70fC54B13FA83571006c289B9A6bbAE69dfD4e46'
// }

interface IAccountContext {
  adexAccount: IAdExAccount | null
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  connectWallet: () => void
}

const defaultContext = {
  adexAccount: null,
  authenticated: false,
  ambireSDK: ambireLoginSDK,
  connectWallet: ambireLoginSDK.openLogin
}

const AccountContext = createContext<IAccountContext>(defaultContext)

// TODO: persist data
const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const ambireSDK = useMemo(() => ambireLoginSDK, [])
  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: null
  })
  // const authenticated = !!adexAccount

  useEffect(() => {
    ambireSDK.onLoginSuccess((data: any) => {
      setAdexAccount({ address: data.address, email: 'testMail@yourmail.com' })
    })
  }, [ambireSDK, setAdexAccount])

  const connectWallet = useCallback(async () => {
    ambireLoginSDK.openLogin()
  }, [])

  const authenticated = useMemo(() => !!adexAccount, [adexAccount])

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      connectWallet,
      ambireSDK
    }),
    [adexAccount, ambireSDK, authenticated, connectWallet]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext }
export default AccountProvider
