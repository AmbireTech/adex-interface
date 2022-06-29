
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Platform from 'components/Platform/Platform'
import AccountSelector from 'components/AccountSelector/AccountSelector'
import { useAccount, useToasts } from 'hooks'
import { Main } from "grommet"

function Root() {

    const { authenticated } = useAccount()
    const location = useLocation()
    const { addToast } = useToasts()

    return (
        <Main>
            <div onClick={() => addToast('adex', { url: 'https://www.adex.network/' })}>{location.pathname}</div>
            <Routes>
                <Route path='account-select'
                    element={<AccountSelector />}
                />
                <Route path='platform/*'
                    element={
                        authenticated ?
                            <Platform />
                            : <Navigate replace to='account-select' />
                    }
                />
                <Route path="/"
                    element={
                        <Navigate replace to={authenticated ? 'platform/dashboard' : 'account-select'} />
                    }
                />
            </Routes>
        </Main>
    )
}

export default Root
