import { parse } from 'url';

export const locationFromUrl = (url, parseQS = false) => {
  const { pathname, search, hash } = parse(url, parseQS);
  return {
    pathname,
    search: search || '',
    hash: hash || '',
  };
};
