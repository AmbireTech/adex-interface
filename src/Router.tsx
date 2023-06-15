import Dashboard from 'components/Dashboard'
import LogIn from 'components/LogIn'
import Billing from 'components/Billing'
import BillingDetails from 'components/Billing/BillingDetails'
import GetStarted from 'components/GetStarted'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'

import useAccount from 'hooks/useAccount'
import Invoices from 'components/Billing/Invoices'
import AccountStatements from 'components/Billing/AccountStatements'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authenticated } = useAccount()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    )
  },
  {
    path: '/login',
    element: <LogIn />
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Dashboard />
      </RequireAuth>
    ),
    children: [
      {
        // TODO: add RequireAuth
        // TODO: Remove it from dashboard route
        path: 'billing',
        element: <Billing />,
        children: [
          {
            path: 'billing-details',
            element: <BillingDetails />
          },
          {
            path: 'invoices',
            element: <Invoices />
          },
          {
            path: 'account-statements',
            element: <AccountStatements />
          }
        ]
      },
      {
        path: 'get-started',
        element: <GetStarted />
      }
    ]
  }
])
