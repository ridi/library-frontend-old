import { CacheProvider } from '@emotion/core';
import { cache } from 'emotion';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './pages/base/ScrollToTop';
import { makeStoreWithApi } from './store';

const store = makeStoreWithApi({}, {});

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <CacheProvider value={cache}>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </CacheProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app'),
);
