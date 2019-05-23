const nextRoutes = require('next-routes');

const routes = nextRoutes();

const APP_ROUTES = [
  { page: 'purchased/main', pattern: '/' },
  { page: 'login', pattern: '/login' },
  { page: 'serialPreference', pattern: '/serial-preferences' },
  { page: 'serialPreferenceUnit', pattern: '/serial-preferences/:unit_id' },
  { page: 'purchased/main', pattern: '/books' },
  { page: 'purchased/hidden', pattern: '/books/hidden' },
  { page: 'purchased/hiddenUnit', pattern: '/books/hidden/:unit_id' },
  { page: 'purchased/search', pattern: '/books/search' },
  { page: 'purchased/searchUnit', pattern: '/books/search/:unit_id' },
  { page: 'purchased/mainUnit', pattern: '/books/:unit_id' },
  { page: 'shelves/list', pattern: '/shelves' },
  { page: 'shelves/detail', pattern: '/shelf/:uuid' },
  { page: 'errors/notFound', pattern: '/errors/not-found' },
];

APP_ROUTES.forEach(route => routes.add(route));
module.exports = routes;
