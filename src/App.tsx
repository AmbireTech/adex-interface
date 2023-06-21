import { Global, MantineProvider } from '@mantine/core'
import { AccountProvider } from 'contexts/AccountContext'
import BillingDetailsContext from 'contexts/CompanyDetailsContext/BillingDetailsContext'
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
        <BillingDetailsContext>
          <RouterProvider router={router} />
        </BillingDetailsContext>
      </MantineProvider>
    </AccountProvider>
  )
}

export default App
