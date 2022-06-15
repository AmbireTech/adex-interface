import React from 'react';
import { Grommet } from 'grommet';
import theme from './theme';
import Root from './Root'


function App() {
  return (
    <Grommet theme={theme} themeMode='dark' full>
      <Root />
    </Grommet>
  );
}

export default App;
