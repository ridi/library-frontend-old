import { stringify } from 'qs';
import { snakelize } from './snakelize';

export const makeURI = (pathname, query, baseHost = null) => {
  const _query = snakelize(query);
  const path = `${pathname}?${stringify(_query, { skipNulls: true })}`;

  if (baseHost) {
    return `${baseHost}/${path}`;
  }

  return path;
};
