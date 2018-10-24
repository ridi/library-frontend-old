export default {
  get: name => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    return window[name];
  },
};
