import { FC, useState } from 'react'
import { Box, Tag, Select } from 'grommet'
import { useAccount } from 'hooks'
import { shortenedAddress } from 'lib/formatters'
import { IAdExAccount } from 'types'

interface IAccountSelector {
}

const AccountSelector: FC<IAccountSelector> = () => {

    const { identity, availableAdexAccounts } = useAccount()
    const [selected, setSelected] = useState<IAdExAccount | null>(null)

    return (
        <Box>
            <Tag name="Connected wallet" value={identity ? shortenedAddress(identity) : 'Not connected'} />
            <Select
                options={availableAdexAccounts}
                value={
                    <Box wrap direction="row" width="small"> {
                        selected ?
                            <Tag name={selected.name} value={shortenedAddress(selected.adexIdentity)} />

                            :
                            <Box
                                pad={{ vertical: 'xsmall', horizontal: 'small' }}
                                margin="xsmall"
                            >
                                Select AdEx identity
                            </Box>
                    }

                    </Box>

                }
                onChange={(nextSelected) => {
                    setSelected(nextSelected.value)
                }}
            >
                {({ name, adexIdentity }, state) =>
                    <Box pad="small" background={state.active ? 'active' : undefined}>
                        <Tag name={name} value={shortenedAddress(adexIdentity)} />
                    </Box>
                }
            </Select >
        </Box >
    )
}

export default AccountSelector
