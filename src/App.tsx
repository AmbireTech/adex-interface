import { Global, MantineProvider } from '@mantine/core'
import { AccountProvider } from 'contexts/AccountContext'
import { BillingDetailsProvider } from 'contexts/BillingDetailsContext/BillingDetailsContext'
import { RouterProvider } from 'react-router-dom'
import { router } from 'Router'
import { lightTheme } from 'themes'

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        'html, body': {
          [theme.other.media.print]: {
            height: '100%',
            overflow: 'hidden'
          }
        }
      })}
    />
  )
}

function App() {
  return (
    <AccountProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={lightTheme}>
        <GlobalStyles />
        <BillingDetailsProvider>
          <RouterProvider router={router} />
        </BillingDetailsProvider>
      </MantineProvider>
    </AccountProvider>
  )
}

export default App
