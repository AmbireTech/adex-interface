import { FC } from 'react'
import { Nav, Box, Anchor } from "grommet"
import { useAccount } from 'hooks'
import { AccountType } from 'types'
import { useNavigate } from "react-router-dom"


const AppNav: FC = () => {
    const { accountType } = useAccount()
    const navigate = useNavigate()

    return (
        <Nav direction='row' background='brand' pad='small' gap='small' wrap>
            <Box pad={{ vertical: 'small' }}>
                <Anchor onClick={() => navigate('/')}>
                    Dashboard
                </Anchor>
            </Box>

            {accountType === AccountType.UNSET &&
                <Box pad={{ vertical: 'small' }}>
                    <Anchor onClick={() => navigate('/Audiences')}>
                        Audiences
                    </Anchor>
                </Box>
            }

        </Nav>
    )
}

export default AppNav