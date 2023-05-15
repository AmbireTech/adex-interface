import { MantineProvider } from '@mantine/core'
import { AccountProvider } from 'contexts/AccountContext'
import { RouterProvider } from 'react-router-dom'
import { router } from 'Router'

function App() {
  return (
    <AccountProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <RouterProvider router={router} />
      </MantineProvider>
    </AccountProvider>
  )
}

export default App
