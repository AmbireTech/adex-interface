import { createContext, FC, PropsWithChildren, useMemo, useState, useCallback } from 'react'
import { Account } from 'types'
import { useAdExApi } from 'hooks/useAdexServices'
import { removeOptionalEmptyStringProps } from 'helpers'

type Deposit = {
  accountId: string
  amount: number
  token: {
    name: string
    chainId: number
    address: string
    decimals: number
  }
  txHash: string
}

interface IAdminContext {
  accounts: Map<string, Account>
  updateAccounts: () => void
  initialDataLoading: boolean
  makeDeposit: (
    values: Deposit,
    onSuccess?: () => void,
    onError?: (err: string) => void
  ) => Promise<void>
  updateAccountInfo: (
    account: Account,
    onSuccess?: () => void,
    onError?: (err: string) => void
  ) => Promise<void>
}

const AdminContext = createContext<IAdminContext | null>(null)

const AdminProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
  const [initialDataLoading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<Map<string, Account>>(new Map<string, Account>())

  const updateAccounts = useCallback(async () => {
    try {
      const res = await adexServicesRequest<Array<Account>>('backend', {
        route: '/dsp/admin/accounts/all',
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })

      console.log({ res })

      if (Array.isArray(res)) {
        setAccounts((prev) => {
          const next = new Map(prev)

          res.forEach((a: Account) => {
            next.set(a.id, {
              ...a,
              info: a.info || {
                notes: '',
                email: '',
                contactPerson: '',
                phone: ''
              }
            })
          })

          return next
        })
      }
    } catch (err) {
      console.log({ err })
    }
    setLoading(false)
  }, [adexServicesRequest])

  const makeDeposit = useCallback(
    async (values: Deposit, onSuccess?: () => void, onErr?: (err: string) => void) => {
      const submit = async () => {
        console.log({ values })
        const { accountId, ...body } = values
        console.log({ body })

        try {
          const res = await adexServicesRequest('backend', {
            route: `/dsp/admin/accounts/${accountId}/deposit`,
            method: 'POST',
            body,
            headers: {
              'content-type': 'application/json'
            }
          })

          console.log({ res })
          onSuccess && onSuccess()
        } catch (err) {
          console.log({ err })
          onErr && onErr(err?.toString() || '')
        }
      }

      await submit()
    },
    [adexServicesRequest]
  )

  const updateAccountInfo = useCallback(
    async (account: Account, onSuccess?: () => void, onErr?: (err: string) => void) => {
      const submit = async () => {
        console.log({ account })
        const { id, name, info, billingDetails } = account

        const body = {
          ...{ name },
          ...{ info: removeOptionalEmptyStringProps(info) },
          ...(billingDetails.verified !== undefined && {
            billingDetails: { verified: billingDetails.verified }
          })
        }

        console.log({ body })

        try {
          const res = await adexServicesRequest('backend', {
            route: `/dsp/admin/accounts/${id}/info`,
            method: 'PUT',
            body,
            headers: {
              'content-type': 'application/json'
            }
          })

          console.log({ res })
          onSuccess && onSuccess()
        } catch (err) {
          console.log({ err })
          onErr && onErr(err?.toString() || '')
        }
      }

      await submit()
    },
    [adexServicesRequest]
  )

  const contextValue = useMemo(
    () => ({
      accounts,
      updateAccounts,
      initialDataLoading,
      makeDeposit,
      updateAccountInfo
    }),
    [accounts, initialDataLoading, makeDeposit, updateAccounts, updateAccountInfo]
  )

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>
}

export { AdminContext, AdminProvider }
