
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Platform from 'components/Platform/Platform'
import AccountSelector from 'components/AccountSelector/AccountSelector'
import { useAccount } from 'hooks'

function Root() {

    const { authenticated } = useAccount()

    return (
        <Router>
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
        </Router>

    );
}

export default Root;
