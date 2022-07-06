import { FC, useState, useCallback } from 'react'
import { Box, Tag, Form, TextInput, FormField, RadioButtonGroup, Button } from 'grommet'
import { useAccount, useToasts } from 'hooks'
import { shortenedAddress } from 'lib/formatters'
import { IAdExAccount, AccountType } from 'types'
import { useNavigate } from "react-router-dom"

interface IAccountSelector { }

const AccountSelector: FC<IAccountSelector> = () => {
    const navigate = useNavigate()
    const { addToast } = useToasts()
    const { identity, registerAdexUser, authenticated, adexAccount } = useAccount()
    const [loading, setLoading] = useState(false)

    const onSubmit = async ({ value }: { value: IAdExAccount }) => {
        setLoading(true)
        const { error } = await registerAdexUser(value)
        setLoading(false)

        if (!error) {
            navigate('/platform/dashboard')
            addToast('AdEx Account registered!', { sticky: true, status: 'ok' })
        }
    }

    const onContinueAs = useCallback(() => {
        navigate('/platform/dashboard')
    }, [navigate])

    return (
        <Box>
            <Tag name='Connected wallet' value={identity ? shortenedAddress(identity) : 'Not connected'} />

            {authenticated && adexAccount &&
                <Button
                    label={`Continue as ${adexAccount.email}`}
                    onClick={onContinueAs}
                />
            }

            <Box pad='small' hidden={!authenticated && !adexAccount}>
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

        </Box >
    )
}

export default AccountSelector
