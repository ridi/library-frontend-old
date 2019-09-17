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

export const BooksPageKind = {
  MAIN: 'main',
  SEARCH: 'search',
  HIDDEN: 'hidden',
};

export const URLMap = {
  [PageType.INDEX]: {
    href: '/purchased/main',
    path: '/',
    as: '/',
    regex: /^\/$/,
  },
  [PageType.LOGIN]: {
    href: '/login',
    path: '/login',
    as: '/login',
    regex: /^\/login\/?$/,
  },
  [PageType.MAIN]: {
    href: '/purchased/main',
    path: '/books',
    as: '/books',
    regex: /^\/books\/?$/,
  },
  [PageType.MAIN_UNIT]: {
    href: '/purchased/mainUnit',
    path: '/books/:unitId',
    as: ({ unitId }) => `/books/${unitId}/`,
    regex: /^\/books\/(\d+)\/?$/,
    keys: ['unitId'],
  },
  [PageType.SEARCH]: {
    href: '/purchased/search',
    path: '/books/search',
    as: '/books/search',
    regex: /^\/books\/search\/?$/,
  },
  [PageType.SEARCH_UNIT]: {
    href: '/purchased/searchUnit',
    path: '/books/search/:unitId',
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
    path: '/books/hidden/:unitId',
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
    path: '/shelf/:uuid/:unitId',
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
