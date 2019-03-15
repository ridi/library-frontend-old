import { delay } from './delay';

export class NoMoreRetryError {
  constructor(error) {
    this.error = error;
  }
}

export const retry = async (options, fn, ...params) => {
  const { retryCount, retryDelay } = options;

  try {
    return await fn(...params);
  } catch (err) {
    if (err instanceof NoMoreRetryError()) {
      throw err.error;
    }

    if (retryCount === 1) {
      throw err;
    }

    await delay(retryDelay);
    return await retry({ retryCount: retryCount - 1, retryDelay }, fn, ...params);
  }
};
