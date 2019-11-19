import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import ScrollManager from './ScrollManager';
import { makeStoreWithApi } from './store';
import TrackManager from './TrackManager';

const store = makeStoreWithApi({}, {});
const styleCache = createCache();

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <CacheProvider value={styleCache}>
        <ScrollManager />
        <TrackManager />
        <App />
      </CacheProvider>
    </Provider>
  </BrowserRouter>,
  document.getElementById('app'),
);
