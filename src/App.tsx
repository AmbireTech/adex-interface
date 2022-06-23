import React from 'react';
import { Grommet } from 'grommet';
import theme from './theme';
import Root from './Root'
import AccountProvider from 'components/providers/AccountProvider/AccountProvider'
import SafeProvider from 'lib/safe-apps-react-sdk'
import { HashRouter as Router } from 'react-router-dom'


function App() {
  return (
    <Grommet theme={theme} themeMode='dark' full>
      <SafeProvider>
        <AccountProvider>
          <Router>
            <Root />
          </Router>
        </AccountProvider>
      </SafeProvider>
    </Grommet>
  );
}

export default App;
