import { FC } from 'react'
import { Nav, Box, Button } from "grommet"
import { useAccount } from 'hooks'
import { AccountType } from 'types'
import { useNavigate, useMatch } from "react-router-dom"

const AppNav: FC = () => {
    const { accountType } = useAccount()
    const navigate = useNavigate()

    return (
        <Nav direction='row' background='brand' pad={{ horizontal: 'xsmall' }} gap='small' wrap justify='stretch'>

            <Box pad={{ vertical: 'xsmall' }}>
                <Button
                    label='Dashboard'
                    size='small'
                    fill='horizontal'
                    secondary
                    active={!!useMatch('/platform/dashboard')}
                    onClick={() => navigate('/platform/dashboard')} />
            </Box>

            <Box pad={{ vertical: 'xsmall' }}
                hidden={accountType !== AccountType.UNSET}
            >
                <Button
                    label='Audiences'
                    size='small'
                    fill='horizontal'
                    secondary
                    active={!!useMatch('/platform/audiences')}
                    onClick={() => navigate('/platform/audiences')} />
            </Box>

        </Nav>
    )
}

export default AppNav