import { FC } from 'react'
import { Nav, Box, Button, Sidebar, Text, Grommet } from 'grommet'
import { ThemeType } from 'grommet/themes'
import { useAccount } from 'hooks'
import { AccountType } from 'types'
import { useNavigate, useMatch } from 'react-router-dom'
import { Template, Group, } from 'grommet-icons'


const sdeNavTheme: ThemeType = {
    button: {
        border: {
            radius: undefined,
            color: '#2196f3',
        },
        disabled: {
            color: '#fe2693',
            opacity: '.2',
            border: {
                color: '#000000',
                width: '10px',
            },
        },
        padding: {
            vertical: '12px',
            horizontal: '24px',
        },
        primary: {
            color: '#2196f3',
        },
        active: {
            background: {
                color: {
                    dark: '#80FFDB',
                    light: "#00C8FF"
                }
            }
        }
    }
}

const AppNav: FC = () => {
    const { accountType } = useAccount()
    const navigate = useNavigate()

    return (
        <Sidebar
            background="background-sidebar"
            width='260px'
            overflow={{ vertical: 'auto', horizontal: 'hidden' }}
            flex='grow'
            pad={{ horizontal: '0', vertical: 'small' }}
        >
            <Grommet theme={sdeNavTheme}>
                <Nav gap='0'>

                    <Button
                        // hoverIndicator='active-sidebar'
                        active={!!useMatch('/platform/dashboard')}
                        onClick={() => navigate('/platform/dashboard')}
                    >
                        <Box pad="small" direction="row" align="center" gap="small">
                            <Template color='accent-1' />
                            <Text>Dashboard</Text>
                        </Box>
                    </Button>


                    <Button
                        // hoverIndicator='active-sidebar'
                        active={!!useMatch('/platform/audiences')}
                        onClick={() => navigate('/platform/audiences')}
                    >
                        <Box pad="small" direction="row" align="center" gap="small">
                            <Group color='accent-1' />
                            <Text>Audiences</Text>
                        </Box>
                    </Button>

                </Nav>
            </Grommet>

        </Sidebar>
    )
}

export default AppNav