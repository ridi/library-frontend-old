class URLMapNotFoundError extends Error {
  constructor() {
    super();
    this.statusCode = 404;
  }
}

export const URLMap = {
  index: {
    href: '/purchased/main',
    as: '/',
    regex: /^\/$/,
  },
  login: {
    href: '/login',
    as: '/login',
    regex: /^\/login\/?$/,
  },
  main: {
    href: '/purchased/main',
    as: '/books',
    regex: /^\/books\/?$/,
  },
  mainUnit: {
    href: '/purchased/mainUnit',
    as: ({ unitId }) => `/books/${unitId}/`,
    regex: /^\/books\/(\d+)\/?$/,
  },
  search: {
    href: '/purchased/search',
    as: '/books/search',
    regex: /^\/books\/search\/?$/,
  },
  searchUnit: {
    href: '/purchased/searchUnit',
    as: ({ unitId }) => `/books/search/${unitId}`,
    regex: /^\/books\/search\/(\d+)\/?$/,
  },
  hidden: {
    href: '/purchased/hidden',
    as: '/books/hidden',
    regex: /^\/books\/hidden\/?$/,
  },
  hiddenUnit: {
    href: '/purchased/hiddenUnit',
    as: ({ unitId }) => `/books/hidden/${unitId}`,
    regex: /^\/books\/hidden\/(\d+)\/?$/,
  },
  serialPreference: {
    href: '/serialPreference',
    as: '/serial-preferences',
    regex: /^\/serial-preferences\/?$/,
  },
  notFound: {
    href: '/errors/notFound',
    as: '/errors/not-found',
    regex: /^\/errors\/not-found\/?$/,
  },
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
  const urlMaps = Object.keys(URLMap).map(key => URLMap[key]);
  for (let index = 0; index < urlMaps.length; index += 1) {
    const urlMap = urlMaps[index];
    const result = urlMap.regex.exec(pathname);

    if (result) {
      if (typeof urlMap.as === 'function') {
        const query = {
          unitId: result[1],
        };
        return {
          href: { pathname: urlMap.href, query },
          as: { pathname: urlMap.as(query) },
        };
      }
      return { href: urlMap.href, as: urlMap.as };
    }
  }

  return { href: URLMap.notFound.href, as: URLMap.notFound.as };
};
