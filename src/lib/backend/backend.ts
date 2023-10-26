import { IAdExAccount, AppError, ErrorLevel } from 'types'

export async function registerUser(
  adexUser: IAdExAccount | null
): Promise<{ adexUser: IAdExAccount | null; error?: AppError }> {
  // TODO: post to backend and return the result as IAdExAccount
  const registered = adexUser?.address && adexUser.email ? { ...adexUser } : null
  const error: AppError | undefined = !registered
    ? {
        severity: ErrorLevel.ERROR,
        error: new Error('User data not provided'),
        message: 'User data not provided'
      }
    : undefined
  return { adexUser: registered, error }
}

export async function getAdexAccountByAddress(
  address: string
): Promise<{ identityAccount: IAdExAccount | null; error?: AppError }> {
  // TODO:

  const current: Array<IAdExAccount> = [
    {
      email: 'mi@yan.co',
      address: '69x70fC54B13FA83571006c289B9A6bbAE69dfD4eA4'
    }
  ]

  return { identityAccount: [...current].find((x) => x.address === address) || null }
}
