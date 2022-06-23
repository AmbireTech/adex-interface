import { IAdExAccount, AppError } from 'types'

export async function registerUser(adexUser: IAdExAccount): Promise<{ adexUser: IAdExAccount, error?: AppError }> {
    // TODO: post to backend and return the result as IAdExAccount
    return { adexUser }
}