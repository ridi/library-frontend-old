const nextRoutes = require('next-routes');

const routes = nextRoutes();

const APP_ROUTES = [
  { page: 'purchased/main', pattern: '/' },
  { page: 'purchased/main', pattern: '/purchased' },
  { page: 'purchased/mainUnit', pattern: '/purchased/:unitId' },
  { page: 'purchased/search', pattern: '/purchased/search' },
  { page: 'purchased/searchUnit', pattern: '/purchased/search/:unitId' },
  { page: 'purchased/hidden', pattern: '/purchased/hidden' },
];

APP_ROUTES.forEach(route => routes.add(route));
module.exports = routes;
