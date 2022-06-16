import { createContext, useState, FC, PropsWithChildren, useMemo } from 'react'
import { ethers, providers } from 'ethers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from 'lib/safe-apps-react-sdk'

interface IAccountContext {
    id: string | null,
    name: string | null,
    provider: providers.Web3Provider
}

const AccountContext = createContext<IAccountContext | null>(null)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const { sdk, safe } = useSafeAppsSDK()
    const provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe])

    const [id, setId] = useState(null)
    const [name, setName] = useState(null)

    return (<AccountContext.Provider
        value={{
            id,
            name,
            provider
        }}
    >
        {children}
    </AccountContext.Provider>
    )
}

export { AccountContext }
export default AccountProvider

