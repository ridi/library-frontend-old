import { delay } from './delay';

export class NoMoreRetryError extends Error {
  constructor(error) {
    super();
    this.error = error;
  }
}

export const retry = async (options, fn, ...params) => {
  const { retryCount, retryDelay } = options;

  try {
    return await fn(...params);
  } catch (err) {
    if (err instanceof NoMoreRetryError) {
      throw err.error;
    }

    if (retryCount === 1) {
      throw err;
    }

    await delay(retryDelay);
    return retry({ retryCount: retryCount - 1, retryDelay }, fn, ...params);
  }
};

export const throwNetworkError = fn => async (...params) => {
  try {
    return await fn(...params);
  } catch (err) {
    // 응답이 있으면 재시도 하지 않는다. 네트워크 에러만 재시도 한다.
    if (err.response) {
      throw new NoMoreRetryError(err);
    }
    throw err;
  }
};
