import { FC, Fragment } from 'react'
import { Routes, Route } from "react-router-dom"
import TopBar from 'components/Platform/TopBar/TopBar'
import Dashboard from 'components/Platform/Dashboard/Dashboard'


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
            </Routes>
        </Fragment>
    )
}

export default Platform

