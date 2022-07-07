import { FC } from 'react'
import { Nav, Box, Button, Sidebar } from "grommet"
import { useAccount } from 'hooks'
import { AccountType } from 'types'
import { useNavigate, useMatch } from 'react-router-dom'
import { Dashboard, Group } from 'grommet-icons'

const AppNav: FC = () => {
    const { accountType } = useAccount()
    const navigate = useNavigate()

    return (
        <Sidebar
            background="brand"
            pad={{ left: 'medium', right: 'large', vertical: 'medium' }}
        >
            <Nav gap='small'>

                <Box pad={{ vertical: 'xsmall' }}>
                    <Button
                        label='Dashboard'
                        size='medium'
                        plain
                        hoverIndicator
                        secondary
                        active={!!useMatch('/platform/dashboard')}
                        onClick={() => navigate('/platform/dashboard')}
                        icon={<Dashboard />}
                    />
                </Box>

                <Box pad={{ vertical: 'xsmall' }}
                    hidden={accountType !== AccountType.UNSET}
                >
                    <Button
                        label='Audiences'
                        size='medium'
                        plain
                        hoverIndicator
                        secondary
                        active={!!useMatch('/platform/audiences')}
                        onClick={() => navigate('/platform/audiences')}
                        icon={<Group />}
                    />
                </Box>

            </Nav>
        </Sidebar>
    )
}

export default AppNav