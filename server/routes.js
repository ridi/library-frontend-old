const nextRoutes = require('next-routes');

const routes = nextRoutes();

const APP_ROUTES = [
  { page: 'index', pattern: '/' },
  { page: 'login', pattern: '/login' },
  { page: 'serialPreference', pattern: '/serial-preference' },
  { page: 'purchased/main', pattern: '/purchased' },
  { page: 'purchased/hidden', pattern: '/purchased/hidden' },
  { page: 'purchased/hiddenUnit', pattern: '/purchased/hidden/:unit_id' },
  { page: 'purchased/search', pattern: '/purchased/search' },
  { page: 'purchased/searchUnit', pattern: '/purchased/search/:unit_id' },
  { page: 'purchased/mainUnit', pattern: '/purchased/:unit_id' },
];

APP_ROUTES.forEach(route => routes.add(route));
module.exports = routes;
