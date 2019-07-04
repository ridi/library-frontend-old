import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import createApiMiddleware from '../api/middleware';
import rootReducer from './reducers';
import rootSaga from './sagas';

const makeComposeEnhancer = isServer => {
  let composeEnhancer = compose;
  if (!isServer) {
    composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  return composeEnhancer;
};

export const makeStore = (initialState, context) => {
  const composeEnhancer = makeComposeEnhancer(context.isServer);

  const apiMiddleware = createApiMiddleware(context);
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [apiMiddleware, sagaMiddleware];

  const store = createStore(rootReducer, initialState, composeEnhancer(applyMiddleware(...middlewares)));

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSaga, context.isServer);
  };
  store.runSagaTask();

  return store;
};
