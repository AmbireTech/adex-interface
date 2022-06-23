
import { Routes, Route, Navigate } from 'react-router-dom'
import Platform from 'components/Platform/Platform'
import AccountSelector from 'components/AccountSelector/AccountSelector'
import { useAccount } from 'hooks'
import { Main } from "grommet"

function Root() {

    const { authenticated } = useAccount()

    return (
        <Main>
            <Routes>
                <Route path='/account-select'
                    element={<AccountSelector />}
                />
                <Route path='/platform'
                    element={
                        authenticated ?
                            <Platform />
                            : <Navigate replace to='/account-select' />
                    }
                />
                <Route path="/"
                    element={
                        <Navigate replace to={authenticated ? '/platform' : '/account-select'} />
                    }
                />
            </Routes>
        </Main>
    )
}

export default Root
