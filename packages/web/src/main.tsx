import * as ReactDOM from 'react-dom';

import App from './app/app';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { StrictMode } from 'react';
import store from './app/redux/store';

ReactDOM.render(
  <StrictMode>
    <ChakraProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ChakraProvider>
  </StrictMode>,
  document.getElementById('root')
);
