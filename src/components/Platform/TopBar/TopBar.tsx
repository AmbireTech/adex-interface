import { FC } from 'react'
import { Header, Image, Box, Text } from 'grommet'
import { useAccount } from 'hooks'
import AdxLogo from 'assets/logos/Ambire_AdEx_color_white_hor.svg'
import { shortenedAddress } from 'lib/formatters'
// import AppNav from './AppNav'


const TopBar: FC = () => {
    const { identity, adexAccount } = useAccount()

    return (
        <Box>
            <Header
                background="dark"
                pad={{ vertical: 'xsmall', horizontal: 'medium' }}
                align='center'
            >
                <Box height='32px'>
                    <Image
                        fill='vertical'
                        src={AdxLogo}
                    />
                </Box>

                <Box pad='small' direction='row' gap='small' align='start'>
                    <Box direction='column' gap='small'>
                        <Box>
                            <Text size='small'>{adexAccount?.email}</Text>
                        </Box>
                        <Box >
                            <Text size='xsmall'>({shortenedAddress(identity || 'NO ADDR')})</Text>
                        </Box>
                    </Box>
                </Box>
            </Header>
            {/* <AppNav /> */}
        </Box>
    )
}

export default TopBar