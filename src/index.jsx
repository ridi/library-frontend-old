import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import { makeStore } from './store';

const store = makeStore({}, {});

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app'),
);