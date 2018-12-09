export const URLMap = {
  main: {
    href: '/purchased/main',
    as: '/purchased',
  },
  search: {
    href: '/purchased/search',
    as: '/purchased/search',
  },
  hidden: {
    href: '/purchased/hidden',
    as: '/purchased/hidden',
  },
  mainUnit: {
    href: 'purchased/mainUnit',
    as: unitId => `purchased/${unitId}`,
  },
};
