import 'core-js/stable';
import 'regenerator-runtime/runtime';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { getApi } from './api';
import App from './App';
import ScrollManager from './ScrollManager';
import { makeStoreWithApi } from './store';
import TrackManager from './TrackManager';

import { ItemStore, ItemStoreProvider } from './models/items';

const store = makeStoreWithApi({}, {});
const styleCache = createCache();
const itemStore = ItemStore.create(
  {
    books: {},
    units: {},
    pageGroups: {},
  },
  {
    privateApi: getApi(null),
  },
);

const container = document.getElementById('app');
ReactDOM.render(
  <BrowserRouter>
    <ItemStoreProvider value={itemStore}>
      <Provider store={store}>
        <CacheProvider value={styleCache}>
          <ScrollManager />
          <TrackManager />
          <App />
        </CacheProvider>
      </Provider>
    </ItemStoreProvider>
  </BrowserRouter>,
  container,
);
container.style.height = '';
