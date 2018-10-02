
import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers'

const makeMiddlewares = () => {
  const middlewares = [thunk];
  return middlewares;
};

const makeComposeEnhancer = isServer => {
  let composeEnhancer = compose;
  if (!isServer) {
    composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  }

  return composeEnhancer;
};

const makeStore = (initialState = {}, context) => {
  const { isServer } = context;

  const composeEnhancer = makeComposeEnhancer(isServer);
  const middlewares = makeMiddlewares();
  
  return createStore(
    rootReducer,
    initialState,
    composeEnhancer(applyMiddleware(...middlewares))
  );
};

const injectStore = withRedux(makeStore);
export default injectStore;
