export const LOCAL_STORAGE = 'localStorage';
export const LOCATION = 'location';
export const REDUX_DEV_TOOLS = '__REDUX_DEVTOOLS_EXTENSION_COMPOSE__';

const WindowEvents = {
  BEFORE_UNLOAD: 'beforeunload',
};

export const getBeforePageUnloadEventFunc = message => {
  return beforeunloadEvent => {
    const beforeunloadMessage = message;
    beforeunloadEvent.preventDefault();
    beforeunloadEvent.returnValue = beforeunloadMessage;
    return beforeunloadMessage;
  };
};

export const addBeforeunloadEventListener = eventListener => {
  window.addEventListener(WindowEvents.BEFORE_UNLOAD, eventListener);
};

export const removeBeforeunloadEventListener = eventListener => {
  window.removeEventListener(WindowEvents.BEFORE_UNLOAD, eventListener);
};

export default {
  get: name => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window[name];
  },
};
