import { FC } from 'react'
import { Box, Tag } from 'grommet'
import { useAccount } from 'hooks'
import { shortenedAddress } from 'lib/formatters'

interface IAccountSelector {
}

const AccountSelector: FC<IAccountSelector> = () => {

    const { identity } = useAccount()

    return (
        <Box>
            <Tag name="Connected wallet" value={identity ? shortenedAddress(identity) : 'Not connected'} />
        </Box>
    )
}

export default AccountSelector
