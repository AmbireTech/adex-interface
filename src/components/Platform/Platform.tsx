import { FC, Fragment } from 'react'
import { Routes, Route } from "react-router-dom"
import TopBar from 'components/Platform/TopBar/TopBar'
import Dashboard from 'components/Platform/Dashboard/Dashboard'
import Audiences from 'components/Platform/Audiences/Audiences'


interface IPlatform {
}

const Platform: FC<IPlatform> = () => {

    return (
        <Fragment>
            <TopBar />
            <Routes>
                <Route path='/'
                    element={<Dashboard />}
                />
                <Route path='/audiences'
                    element={<Audiences />}
                />
            </Routes>
        </Fragment>
    )
}

export default Platform

