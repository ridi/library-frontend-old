const nextRoutes = require('next-routes');

const routes = nextRoutes();

const APP_ROUTES = [
  { page: 'index', pattern: '/' },
  { page: 'purchased/purchasedUnit', pattern: '/purchased/:unitId' },
  { page: 'about', pattern: '/about' },
  { page: 'post', pattern: '/post/:id' },
  { page: 'post', pattern: '/p/:id' },
];

APP_ROUTES.forEach(route => routes.add(route));
module.exports = routes;
