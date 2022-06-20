import { createContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from 'lib/safe-apps-react-sdk'

interface IAccountContext {
    identity: string | null,
    name: string | null,
    provider: providers.Web3Provider,
}

const AccountContext = createContext<IAccountContext | null>(null)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const { sdk, safe } = useSafeAppsSDK()
    const [identity, setIdentity] = useState<string | null>(null)
    const [name, setName] = useState(null)

    const provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe])

    useEffect(() => {
        setIdentity(safe?.safeAddress || null)
    }, [safe.safeAddress])


    return (<AccountContext.Provider
        value={{
            identity,
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

