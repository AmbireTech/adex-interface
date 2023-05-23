import Dashboard from 'components/Dashboard'
import LogIn from 'components/LogIn'
import Billing from 'components/Billing'
import GetStarted from 'components/GetStarted'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'

import useAccount from 'hooks/useAccount'

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
        path: 'billing',
        element: <Billing />
      },
      {
        path: 'get-started',
        element: <GetStarted />
      }
    ]
  }
])
