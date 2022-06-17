import { FC } from 'react'
import { Routes, Route } from "react-router-dom"
import Dashboard from 'components/Platform/Dashboard/Dashboard'


interface IPlatform {
}

const Platform: FC<IPlatform> = () => {

    return (
        <Routes>
            <Route path='/'
                element={<Dashboard />}
            />
        </Routes>

    )
}

export default Platform

