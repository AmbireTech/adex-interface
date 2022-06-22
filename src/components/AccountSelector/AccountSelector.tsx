import { FC, useState } from 'react'
import { Box, Tag, Select, Form, TextInput, FormField, RadioButtonGroup, Button } from 'grommet'
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
                <Box pad='small'>
                    <Box>Create AdEx account</Box>
                    <Form>
                        <FormField label='Name' name='name' required>
                            <TextInput name='name' />
                        </FormField>
                        <FormField label='Email' name='email' required
                            validate={{ regexp: /^\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }}
                        >
                            <TextInput name='email' />
                        </FormField>
                        <FormField name='role' label='Account type' required>
                            <RadioButtonGroup name='role' options={['Advertiser', 'Publisher']} />
                        </FormField>
                        <Button type='submit' label='Create' primary />
                    </Form>
                </Box>
            }
        </Box >
    )
}

export default AccountSelector
