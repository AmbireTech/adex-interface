import {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react'
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
//   email: 'gosho@myyanko.com',
//   address: '0x70fC54B13FA83571006c289B9A6bbAE69dfD4e46'
// }

interface TestType {
  propOne: string
  propTwo?: number
  propThree?: boolean
}

interface IAccountContext {
  adexAccount: IAdExAccount | null
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  testItem: TestType | null
  updateTestItem: (x: any, y: any) => void
  connectWallet: () => void
  disconnectWallet: () => void
}

const AccountContext = createContext<IAccountContext | null>(null)

// TODO: persist data
const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const [testItem, setTestItem] = useState<TestType>({ propOne: 'valueOne' })
  const ambireSDK = useMemo(() => ambireLoginSDK, [])

  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: {
      address: '0xkuramiqnko',
      email: 'mai@il.com'
    }
  })
  // const authenticated = !!adexAccount

  useEffect(() => {
    ambireSDK.onLoginSuccess((data: any) => {
      console.log({ data })
      setAdexAccount({ address: data.address, email: 'testMail@yourmail.com' })
    })

    ambireSDK.onLogoutSuccess((data: any) => {
      console.log({ data })
      setAdexAccount(null)
    })
  }, [ambireSDK, setAdexAccount])

  const connectWallet = useCallback(async () => {
    console.log('connectwallet', ambireSDK)
    ambireLoginSDK.openLogin()
  }, [ambireSDK])

  const disconnectWallet = useCallback(async () => {
    console.log('connectwallet', ambireSDK)
    ambireLoginSDK.openLogout()
  }, [ambireSDK])

  const authenticated = useMemo(() => !!adexAccount, [adexAccount])

  const updateTestItem = useCallback(
    <TestItemKey extends keyof TestType>(key: TestItemKey, value: TestType[TestItemKey]) => {
      setTestItem((x) => {
        const updated = { ...x }
        updated[key] = value
        return updated
      })
    },
    []
  )

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      connectWallet,
      disconnectWallet,
      ambireSDK,
      testItem,
      setTestItem,
      updateTestItem
    }),
    [
      adexAccount,
      ambireSDK,
      authenticated,
      connectWallet,
      disconnectWallet,
      testItem,
      updateTestItem
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
