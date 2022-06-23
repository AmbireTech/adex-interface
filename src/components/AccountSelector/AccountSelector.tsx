import { FC, useState } from 'react'
import { Box, Tag, Select, Form, TextInput, FormField, RadioButtonGroup, Button } from 'grommet'
import { useAccount } from 'hooks'
import { shortenedAddress } from 'lib/formatters'
import { IAdExAccount, AccountType } from 'types'
import { useNavigate } from "react-router-dom"

interface IAccountSelector { }

const AccountOption = ({ adexAccount }: { adexAccount: IAdExAccount | null }) =>
    <Box pad='small' gap='small' direction='row' flex={{ grow: 1 }} >
        {adexAccount && <Box>{adexAccount.name}:</Box>}
        {adexAccount && <Box>{shortenedAddress(adexAccount?.adexIdentity || '...')}</Box>}
        {!adexAccount && 'Select AdEx identity'}
    </Box>

const AccountSelector: FC<IAccountSelector> = () => {
    const navigate = useNavigate()
    const { identity, availableAdexAccounts, registerAdexUser } = useAccount()
    const [selected, setSelected] = useState<IAdExAccount | null>(null)
    const [loading, setLoading] = useState(false)

    const onSubmit = async ({ value }: { value: IAdExAccount }) => {
        setLoading(true)
        const { error } = await registerAdexUser(value)
        setLoading(false)

        if(!error) navigate('/')
    }


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
                    <Form onSubmit={onSubmit}>
                        <FormField label='Name' name='name' required>
                            <TextInput name='name' />
                        </FormField>
                        <FormField label='Email' name='email' required
                            validate={{ regexp: /^\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ }}
                        >
                            <TextInput name='email' />
                        </FormField>
                        <FormField name='role' label='Account type' required>
                            <RadioButtonGroup name='role' options={[
                                {
                                    id: AccountType.ADVERTISER.toString(),
                                    value: AccountType.ADVERTISER,
                                    label: 'Advertiser'
                                },
                                {
                                    id: AccountType.PUBLISHER.toString(),
                                    value: AccountType.PUBLISHER,
                                    label: 'Publisher'
                                }
                            ]} />
                        </FormField>
                        <Button type='submit' label='Create' primary disabled={loading} />
                    </Form>
                </Box>
            }
        </Box >
    )
}

export default AccountSelector
