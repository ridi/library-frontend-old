import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import { initializeApi } from '../api';
import createApiMiddleware from '../api/middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';

export const makeStoreWithApi = (initialState, context) => {
  const devTools = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
  const composeEnhancers = devTools || compose;
  const apiMiddleware = createApiMiddleware(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [apiMiddleware, sagaMiddleware];

  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));
  initializeApi(null, store);

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga);
  };
  store.runSagaTask();

  return store;
};
