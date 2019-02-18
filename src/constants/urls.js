class URLMapNotFoundError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
  }
}

export const URLMap = {
  login: {
    href: '/login/',
    as: '/login/',
    regex: /^\/login\/$/,
  },
  main: {
    href: '/purchased/main/',
    as: '/purchased/',
    regex: /^\/purchased\/$/,
  },
  mainUnit: {
    href: '/purchased/mainUnit/',
    as: ({ unitId }) => `/purchased/${unitId}/`,
    regex: /^\/purchased\/(?<unitId>\d+)\/$/,
  },
  search: {
    href: '/purchased/search/',
    as: '/purchased/search/',
    regex: /^\/purchased\/search\/$/,
  },
  searchUnit: {
    href: '/purchased/searchUnit/',
    as: ({ unitId }) => `/purchased/search/${unitId}/`,
    regex: /^\/purchased\/search\/(?<unitId>\d+)\/$/,
  },
  hidden: {
    href: '/purchased/hidden/',
    as: '/purchased/hidden/',
    regex: /^\/purchased\/hidden\/$/,
  },
  hiddenUnit: {
    href: '/purchased/hiddenUnit/',
    as: ({ unitId }) => `/purchased/hidden/${unitId}/`,
    regex: /^\/purchased\/hidden\/(?<unitId>\d+)\/$/,
  },
  serialPreference: {
    href: '/serialPreference/',
    as: '/serial-preference/',
    regex: /^\/serial-preference\/$/,
  },
};

export const toURLMap = pathname => {
  if (pathname === '/') {
    return URLMap.main;
  }

  const urlMaps = Object.keys(URLMap).map(key => URLMap[key]);
  for (let index = 0; index < urlMaps.length; index += 1) {
    const urlMap = urlMaps[index];
    const result = urlMap.regex.exec(pathname);

    if (result) {
      if (typeof urlMap.as === 'function') {
        return {
          href: { pathname: urlMap.href, query: { ...result.groups } },
          as: { pathname: urlMap.as(result.groups) },
        };
      }
      return urlMap;
    }
  }

  throw new URLMapNotFoundError();
};
