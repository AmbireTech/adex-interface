import { FC, Fragment } from 'react'
import { Routes, Route } from "react-router-dom"
import TopBar from 'components/Platform/TopBar/TopBar'
import SideNav from 'components/Platform/SideNav/SideNav'
import Dashboard from 'components/Platform/Dashboard/Dashboard'
import Audiences from 'components/Platform/Audiences/Audiences'
import { Page, Box } from 'grommet'

interface IPlatform {
}

const Platform: FC<IPlatform> = () => {

    return (
        <Box flex direction='row' responsive >
            <SideNav />
            <Page pad={{horizontal: 'small', bottom: 'small'}}>
                <TopBar />
                <Routes>
                    <Route path='dashboard'
                        element={<Dashboard />}
                    />
                    <Route path='audiences'
                        element={<Audiences />}
                    />
                </Routes>
            </Page>
        </Box>
    )
}

export default Platform

