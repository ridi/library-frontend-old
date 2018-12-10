import { delay } from './delay';

export const retry = async (options, fn, ...params) => {
  const { retryCount, retryDelay } = options;

  try {
    return await fn(...params);
  } catch (err) {
    if (retryCount === 1) {
      throw err;
    }

    await delay(retryDelay);
    return await retry({ retryCount: retryCount - 1, retryDelay }, fn, ...params);
  }
};
