import { FC } from 'react'
import { Header, Image, Box } from "grommet"
import { useAccount } from 'hooks'
import AdxLogo from 'assets/logos/Ambire_AdEx_color_white_hor.svg'
import { shortenedAddress } from 'lib/formatters'
import AppNav from './AppNav'


const TopBar: FC = () => {
    const { identity } = useAccount()

    return (
        <Box>
            <Header
                background="brand"
                pad={{ vertical: 'small', horizontal: 'medium' }}
                align='center'
            >
                <Box height='32px'>
                    <Image
                        fill='vertical'
                        src={AdxLogo}
                    />
                </Box>
                {shortenedAddress(identity || 'NO ADDR')}
            </Header>
            <AppNav />
        </Box>
    )
}

export default TopBar