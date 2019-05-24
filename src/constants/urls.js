class URLMapNotFoundError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
  }
}

export const PageType = {
  INDEX: 'index',
  LOGIN: 'login',
  MAIN: 'main',
  MAIN_UNIT: 'mainUnit',
  SEARCH: 'search',
  SEARCH_UNIT: 'searchUnit',
  HIDDEN: 'hidden',
  HIDDEN_UNIT: 'hiddenUnit',
  SHELVES: 'shelves',
  SERIAL_PREFERENCE: 'serialPreference',
  SERIAL_PREFERENCE_UNIT: 'serialPreferenceUnit',
  SHELF_DETAIL: 'shelfDetail',
  SHELF_UNIT: 'shelfUnit',
  NOT_FOUND: 'notFound',
};

export const URLMap = {
  [PageType.INDEX]: {
    href: '/purchased/main',
    as: '/',
    regex: /^\/$/,
  },
  [PageType.LOGIN]: {
    href: '/login',
    as: '/login',
    regex: /^\/login\/?$/,
  },
  [PageType.MAIN]: {
    href: '/purchased/main',
    as: '/books',
    regex: /^\/books\/?$/,
  },
  [PageType.MAIN_UNIT]: {
    href: '/purchased/mainUnit',
    as: ({ unitId }) => `/books/${unitId}/`,
    regex: /^\/books\/(\d+)\/?$/,
    keys: ['unitId'],
  },
  [PageType.SEARCH]: {
    href: '/purchased/search',
    as: '/books/search',
    regex: /^\/books\/search\/?$/,
  },
  [PageType.SEARCH_UNIT]: {
    href: '/purchased/searchUnit',
    as: ({ unitId }) => `/books/search/${unitId}`,
    regex: /^\/books\/search\/(\d+)\/?$/,
    keys: ['unitId'],
  },
  [PageType.HIDDEN]: {
    href: '/purchased/hidden',
    as: '/books/hidden',
    regex: /^\/books\/hidden\/?$/,
  },
  [PageType.HIDDEN_UNIT]: {
    href: '/purchased/hiddenUnit',
    as: ({ unitId }) => `/books/hidden/${unitId}`,
    regex: /^\/books\/hidden\/(\d+)\/?$/,
    keys: ['unitId'],
  },
  [PageType.SERIAL_PREFERENCE]: {
    href: '/serialPreference',
    as: '/serial-preferences',
    regex: /^\/serial-preferences\/?$/,
  },
  [PageType.SERIAL_PREFERENCE_UNIT]: {
    href: '/serialPreferenceUnit',
    as: ({ unitId }) => `/serial-preferences/${unitId}/`,
    regex: /^\/serial-preferences\/(\d+)\/?$/,
    keys: ['unitId'],
  },
  [PageType.SHELVES]: {
    href: '/shelves/list',
    as: '/shelves',
    regex: /^\/shelves\/?$/,
  },
  [PageType.SHELF_DETAIL]: {
    href: '/shelves/detail',
    as: ({ uuid }) => `/shelf/${uuid}`,
    regex: /^\/shelf\/([0-9a-f-]+)\/?$/,
    keys: ['uuid'],
  },
  [PageType.SHELF_UNIT]: {
    href: '/purchased/searchUnit',
    as: ({ uuid, unitId }) => `/shelf/${uuid}/${unitId}`,
    regex: /^\/shelf\/([0-9a-f-]+)\/(\d+)\/?$/,
    keys: ['uuid', 'unitId'],
  },
  [PageType.NOT_FOUND]: {
    href: '/errors/notFound',
    as: '/errors/not-found',
    regex: /^\/errors\/not-found\/?$/,
  },
};

export const toPageType = pathname => {
  for (const pageType of Object.values(PageType)) {
    const urlInfo = URLMap[pageType];
    if (urlInfo.regex.test(pathname)) {
      return pageType;
    }
  }

  return PageType.MAIN_UNIT;
};

// XXX: ----
// NextJS에서는 공식적으로 SSR 비활성화를 지원하지 않습니다.
// 해당로직은 NextJS에서 SSR을 비활성화하기 위한 트릭용 코드입니다.
// ## 랜더링 구조
// 1. CF에서 어떤 Pathname으로 접근하던 index.html로 랜딩
// 2. index.html은 pages/index.jsx를 export한 empty 페이지
// 3. index.html에 접속시 pathname을 가져와서 실제로 로딩해야하는 페이지로 replace
// ----
export const toURLMap = pathname => {
  const urlMaps = Object.values(URLMap);
  for (let index = 0; index < urlMaps.length; index += 1) {
    const urlInfo = urlMaps[index];
    const result = urlInfo.regex.exec(pathname);

    if (result) {
      if (typeof urlInfo.as === 'function') {
        const query = {};
        urlInfo.keys.forEach((key, idx) => {
          query[key] = result[idx + 1];
        });
        return {
          href: { pathname: urlInfo.href, query },
          as: { pathname: urlInfo.as(query) },
        };
      }
      return { href: urlInfo.href, as: urlInfo.as };
    }
  }

  return { href: URLMap.notFound.href, as: URLMap.notFound.as };
};
