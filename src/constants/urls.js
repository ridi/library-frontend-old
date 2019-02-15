export const URLMap = {
  login: {
    href: '/login',
    as: '/login',
  },
  main: {
    href: '/purchased/main',
    as: '/purchased',
  },
  mainUnit: {
    href: '/purchased/mainUnit',
    as: unitId => `/purchased/${unitId}`,
  },
  search: {
    href: '/purchased/search',
    as: '/purchased/search',
  },
  searchUnit: {
    href: '/purchased/searchUnit',
    as: unitId => `/purchased/search/${unitId}`,
  },
  hidden: {
    href: '/purchased/hidden',
    as: '/purchased/hidden',
  },
  hiddenUnit: {
    href: '/purchased/hiddenUnit',
    as: unitId => `/purchased/hidden/${unitId}`,
  },
  serialPreference: {
    href: '/serialPreference',
    as: '/serial-preference',
  },
};
