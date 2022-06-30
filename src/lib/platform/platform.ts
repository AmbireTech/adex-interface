import { IAdExAccount, AppError, ErrorLevel } from 'types'

export async function registerUser(adexUser: IAdExAccount | null, signer?: string): Promise<{ adexUser: IAdExAccount | null, error?: AppError }> {
    // TODO: post to backend and return the result as IAdExAccount
    const registered = (adexUser && signer) ? { ...adexUser, signers: signer ? [signer] : [], adexIdentity: '69' + signer.substring(1) } : null
    const error: AppError | undefined = !registered ? {
        severity: ErrorLevel.ERROR,
        error: new Error('User data not provided'),
        message: 'User data not provided'
    } : undefined
    return { adexUser: registered, error }
}

export async function getAdexAccountsByIdentity(identity: string): Promise<{ identityAccounts: Array<IAdExAccount>, error?: AppError }> {
    // TODO:

    const current: Array<IAdExAccount> = [{ "name": "kora", "email": "mi@yan.co", "role": 1, "signers": ["0x70fC54B13FA83571006c289B9A6bbAE69dfD4eA4"], adexIdentity: "69x70fC54B13FA83571006c289B9A6bbAE69dfD4eA4" }]



    return { identityAccounts: [...current].filter(x => x.signers.includes(identity)) }

}