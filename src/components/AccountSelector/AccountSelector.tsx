import { FC, useState } from 'react'
import { Box, Tag, Select, Form, TextInput, FormField, MaskedInput, RadioButtonGroup } from 'grommet'
import { useAccount } from 'hooks'
import { shortenedAddress } from 'lib/formatters'
import { IAdExAccount } from 'types'

interface IAccountSelector {
}

const AccountOption = ({ adexAccount }: { adexAccount: IAdExAccount | null }) =>
    <Box pad='small' gap='small' direction='row' flex={{ grow: 1 }} >
        {adexAccount && <Box>{adexAccount.name}:</Box>}
        {adexAccount && <Box>{shortenedAddress(adexAccount?.adexIdentity || '...')}</Box>}
        {!adexAccount && 'Select AdEx identity'}
    </Box>

const AccountSelector: FC<IAccountSelector> = () => {

    const { identity, availableAdexAccounts } = useAccount()
    const [selected, setSelected] = useState<IAdExAccount | null>(null)

    return (
        <Box>
            <Tag name='Connected wallet' value={identity ? shortenedAddress(identity) : 'Not connected'} />

            {!availableAdexAccounts.length ?
                <Select
                    width='full'
                    options={availableAdexAccounts}
                    value={<AccountOption adexAccount={selected} />}
                    onChange={(nextSelected) => {
                        setSelected(nextSelected.value)
                    }}
                >
                    {(adexAccount) => <AccountOption adexAccount={adexAccount} />}
                </Select >
                :
                <Box>
                    <Box>Create AdEx account</Box>
                    <Form>
                        <FormField label='Name' name='name'>
                            <TextInput name='name' />
                        </FormField>
                        <FormField label='Email' name='email' required>
                            <MaskedInput
                                name='email'
                                mask={[
                                    {
                                        regexp: /^\w+([\.\-+]?\w+)*@\w+([\.\-]?\w+)*(\.\w{2,3})+$/,
                                        placeholder: 'example@maymail.com'
                                    },
                                ]}
                            />
                        </FormField>
                        <FormField name='role' label='Account type'>
                            <RadioButtonGroup name='role' options={['Advertiser', 'Publisher']} />
                        </FormField>
                    </Form>
                </Box>
            }
        </Box >
    )
}

export default AccountSelector
