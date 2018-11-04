import { stringify } from 'qs';

export const makeURI = (pathname, query, baseHost = null) => {
  const path = `${pathname}?${stringify(query, { skipNulls: true })}`;

  if (baseHost) {
    return `${baseHost}/${path}`;
  }

  return path;
};
