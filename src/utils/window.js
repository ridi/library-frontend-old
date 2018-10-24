export const LOCAL_STORAGE = 'localStorage';
export const LOCATION = 'location';
export const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

export default {
  get: name => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window[name];
  },
};
