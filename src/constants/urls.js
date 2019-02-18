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
    as: unitId => `/purchased/${unitId}/`,
    regex: /^\/purchased\/(?<unitId>\d+)\/$/,
  },
  search: {
    href: '/purchased/search/',
    as: '/purchased/search/',
    regex: /^\/purchased\/search\/$/,
  },
  searchUnit: {
    href: '/purchased/searchUnit/',
    as: unitId => `/purchased/search/${unitId}/`,
    regex: /^\/purchased\/search\/(?<unitId>\d+)\/$/,
  },
  hidden: {
    href: '/purchased/hidden/',
    as: '/purchased/hidden/',
    regex: /^\/purchased\/hidden\/$/,
  },
  hiddenUnit: {
    href: '/purchased/hiddenUnit/',
    as: unitId => `/purchased/hidden/${unitId}/`,
    regex: /^\/purchased\/hidden\/(?<unitId>\d+)\/$/,
  },
  serialPreference: {
    href: '/serialPreference/',
    as: '/serial-preference/',
    regex: /^\/serial-preference\/$/,
  },
};

export const toURLMap = pathname => {
  const urlMaps = Object.keys(URLMap).map(key => URLMap[key]);
  for (let index = 0; index < urlMaps.length; index += 1) {
    const urlMap = urlMaps[index];
    const result = urlMap.regex.exec(pathname);

    if (result) {
      if (typeof urlMap.as === 'function') {
        const { unitId } = result.groups;
        return {
          href: { pathname: urlMap.href, query: { unitId } },
          as: { pathname: urlMap.as(unitId) },
        };
      }
      return urlMap;
    }
  }

  return {
    href: '/not-found/',
    as: '/not-found/',
  };
};
