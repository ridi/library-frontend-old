const nextRoutes = require('next-routes');

const routes = nextRoutes();

const APP_ROUTES = [
  { page: 'index', pattern: '/' },
  { page: 'index', pattern: '/purchased' },
  { page: 'purchased/hidden', pattern: '/purchased/hidden' },
  { page: 'purchased/purchasedMainUnit', pattern: '/purchased/:unitId' },
];

APP_ROUTES.forEach(route => routes.add(route));
module.exports = routes;
