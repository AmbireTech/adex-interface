import { createContext, FC, PropsWithChildren, useMemo, useState, useCallback } from 'react'
import { Account, AdminTransfer, AdminTransferType } from 'types'
import { useAdExApi } from 'hooks/useAdexServices'
import { removeOptionalEmptyStringProps } from 'helpers'
import { DspStats } from 'types/dspStats'

interface IAdminContext {
  accounts: Map<string, Account>
  getAllAccounts: () => void
  dspStats: DspStats
  getDspStats: () => void
  initialDataLoading: boolean
  makeTransfer: (
    values: AdminTransfer,
    type: AdminTransferType,
    onSuccess?: () => void,
    onError?: (err: string) => void
  ) => Promise<void>
  updateAccountInfo: (
    account: Account,
    onSuccess?: () => void,
    onError?: (err: string) => void
  ) => Promise<void>
}

const dspStatsDefault = {
  totalRequests: 0,
  ortbRequests: 0,
  throttledRequests: 0,
  ortbRequestsPerSecond: 0,
  throttledRequestsPerSecond: 0,
  bidRequestsWithNoBids: 0,
  bidRequestsBidsInTime: 0,
  bidRequestsWithBidsLate: 0,
  ssp: []
}

const AdminContext = createContext<IAdminContext | null>(null)

const AdminProvider: FC<PropsWithChildren> = ({ children }) => {
  const { adexServicesRequest } = useAdExApi()
  const [initialDataLoading, setLoading] = useState(true)
  const [accounts, setAccounts] = useState<Map<string, Account>>(new Map<string, Account>())
  const [dspStats, setDspStats] = useState<DspStats>(dspStatsDefault)

  const getAllAccounts = useCallback(async () => {
    try {
      const res = await adexServicesRequest<Array<Account>>('backend', {
        route: '/dsp/admin/accounts/all',
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })

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

  const makeTransfer = useCallback(
    async (
      values: AdminTransfer,
      type: AdminTransferType,
      onSuccess?: () => void,
      onErr?: (err: string) => void
    ) => {
      const submit = async () => {
        try {
          const { accountId, ...body } = values

          await adexServicesRequest('backend', {
            route: `/dsp/admin/accounts/${accountId}/${type}`,
            method: 'POST',
            body,
            headers: {
              'content-type': 'application/json'
            }
          })

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
        try {
          const { id, name, info, billingDetails } = account

          const body = {
            ...{ name },
            ...{ info: removeOptionalEmptyStringProps(info) },
            ...(billingDetails?.verified !== undefined && {
              billingDetails: { verified: billingDetails.verified }
            })
          }

          // console.log({ body })

          await adexServicesRequest('backend', {
            route: `/dsp/admin/accounts/${id}/info`,
            method: 'PUT',
            body,
            headers: {
              'content-type': 'application/json'
            }
          })

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

  const getDspStats = useCallback(async () => {
    try {
      const res = await adexServicesRequest<DspStats>('backend', {
        route: '/dsp/admin/sysinfo',
        method: 'GET',
        headers: {
          'content-type': 'application/json'
        }
      })

      if (res) {
        setDspStats(res)
      }
    } catch (err) {
      console.log({ err })
    }
  }, [adexServicesRequest])

  const contextValue = useMemo(
    () => ({
      accounts,
      getAllAccounts,
      getDspStats,
      dspStats,
      initialDataLoading,
      makeTransfer,
      updateAccountInfo
    }),
    [
      accounts,
      getAllAccounts,
      getDspStats,
      dspStats,
      initialDataLoading,
      makeTransfer,
      updateAccountInfo
    ]
  )

  return <AdminContext.Provider value={contextValue}>{children}</AdminContext.Provider>
}

export { AdminContext, AdminProvider }
