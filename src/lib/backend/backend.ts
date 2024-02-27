import { fetchService } from 'services'
import { IAdExAccount, AppError, ErrorLevel } from 'types'

const processResponse = (res: any) => {
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('something went wrong', text)
      // logOut(skipRedirect)
    }
  })
}

export const getMessageToSign = async (user: IAdExAccount) => {
  // TODO: use process.env.basURL
  const baseUrl = 'http://localhost:3069'
  const body = {
    wallet: user.address,
    chainId: user.chainId
  }
  const headers = {
    'Content-Type': 'application/json'
  }

  const req = {
    url: `${baseUrl}/dsp/login-msg`,
    method: 'POST',
    headers,
    body
  }

  return fetchService(req).then(processResponse)
}

export const verifyLogin = async (user: IAdExAccount) => {
  // TODO: use process.env.basURL
  const baseUrl = 'http://localhost:3069'
  const body = {
    wallet: user.address,
    chainId: user.chainId
  }
  const headers = {
    'Content-Type': 'application/json'
  }

  const req = {
    url: `${baseUrl}/dsp/login-verify`,
    method: 'POST',
    headers,
    body
  }

  return fetchService(req).then(processResponse)
}

export async function registerUser(
  adexUser: IAdExAccount
): Promise<{ adexUser: IAdExAccount | null; error?: AppError }> {
  // TODO: post to backend and return the result as IAdExAccount

  const registered = adexUser?.address && adexUser.chainId ? { ...adexUser } : null
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
      chainId: 1,
      address: '69x70fC54B13FA83571006c289B9A6bbAE69dfD4eA4'
    }
  ]

  return { identityAccount: [...current].find((x) => x.address === address) || null }
}
