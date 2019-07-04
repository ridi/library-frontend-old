import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from './App';
import { makeStore } from './store';

const store = makeStore({}, {});

ReactDOM.render(
  <MemoryRouter initialEntries={['/']}>
    <Provider store={store}>
      <CacheProvider value={cache}>
        <App />
      </CacheProvider>
    </Provider>
  </MemoryRouter>,
  document.getElementById('app'),
);
