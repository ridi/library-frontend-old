import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import createApiMiddleware from '../api/middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';
import bootstrap from './bootstrap';
import settings from '../utils/settings';

const makeComposeEnhancer = isServer => {
  let composeEnhancer = compose;
  if (!isServer) {
    composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  return composeEnhancer;
};

const makeStore = (initialState, context) => {
  const composeEnhancer = makeComposeEnhancer(context.isServer);

  const apiMiddleware = createApiMiddleware(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [apiMiddleware, sagaMiddleware];

  const store = createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(...middlewares)));

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };
  store.runSagaTask();

  return store;
};

const injectStore = withRedux((initialState = {}, context) => {
  // client이거나, server면서 headers가 있을때
  // export 시에 isServer는 True지만 req에 header가 없다.
  if (!context.isServer || context.req.headers) {
    // 라이프사이클상 가장 최초는 여기다.
    settings.setContext(context);
    settings.migrate();
  }

  const preloadState = bootstrap.beforeCreatingStore(initialState, context);
  const store = makeStore(preloadState, context);
  bootstrap.afterCreatingStore(store, context);
  return store;
});
export default injectStore;
