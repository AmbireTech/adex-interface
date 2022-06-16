import { createContext, useState, FC, PropsWithChildren } from 'react'

interface IAccountContext {
    id: string | null,
    name: string | null

}

const AccountContext = createContext<IAccountContext | null>(null)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {

    const [id, setId] = useState(null)
    const [name, setName] = useState(null)

    return (<AccountContext.Provider
        value={{
            id,
            name
        }}
    >
        {children}
    </AccountContext.Provider>
    )
}

export { AccountContext }
export default AccountProvider

