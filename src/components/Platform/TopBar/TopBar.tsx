import { FC } from 'react'
import { Header, Image, Box } from "grommet"
import { useAccount } from 'hooks'
import AdxLogo from 'assets/logos/Ambire_AdEx_color_white_hor.svg'
import { shortenedAddress } from 'lib/formatters'


const Dashboard: FC = () => {
    const account = useAccount()

    return (
        <Header
            background="brand"
            pad={{ vertical: 'small', horizontal: 'medium' }}
            align='center'
        >
            <Box height='xxsmall'>
                <Image
                    fill='vertical'
                    src={AdxLogo}
                />
            </Box>
            {shortenedAddress(account?.identity || 'NO ADDR')}
        </Header>
    )
}

export default Dashboard