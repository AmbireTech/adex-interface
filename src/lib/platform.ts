import { IAdExAccount, AppError, ErrorLevel } from 'types'

export async function registerUser(adexUser: IAdExAccount | null, signer?: string): Promise<{ adexUser: IAdExAccount | null, error?: AppError }> {
    // TODO: post to backend and return the result as IAdExAccount
    const registered = adexUser ? { ...adexUser, signers: signer ? [signer] : [] } : null
    const error: AppError | undefined = !registered ? {
        severity: ErrorLevel.ERROR,
        error: new Error('User data not provided'),
        message: 'User data not provided'
    } : undefined
    return { adexUser: registered, error }
}