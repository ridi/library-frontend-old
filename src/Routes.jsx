import React from 'react';
import { Route, Switch } from 'react-router-dom';

const NotFound = React.lazy(() => import('./pages/errors/notFound'));
const Login = React.lazy(() => import('./pages/login'));
const PurchasedHidden = React.lazy(() => import('./pages/purchased/hidden'));
const PurchasedMain = React.lazy(() => import('./pages/purchased/main'));
const SerialPreference = React.lazy(() => import('./pages/serialPreference'));
const ShelvesList = React.lazy(() => import('./pages/shelves/list'));
const ShelfDetail = React.lazy(() => import('./pages/shelves/detail'));
const Unit = React.lazy(() => import('./pages/unit'));

const routes = [
  {
    component: PurchasedMain,
    path: '/',
    exact: true,
  },
  {
    component: Login,
    path: '/login',
    exact: true,
  },
  {
    component: PurchasedMain,
    path: '/books',
    exact: true,
  },
  {
    component: PurchasedMain,
    path: '/books/search',
    exact: true,
  },
  {
    component: PurchasedHidden,
    path: '/books/hidden',
    exact: true,
  },
  {
    component: SerialPreference,
    path: '/serial-preferences',
    exact: true,
  },
  {
    component: ShelvesList,
    path: '/shelves',
    exact: true,
  },
  {
    component: Unit,
    path: '/shelf/:uuid/:unitId',
  },
  {
    component: ShelfDetail,
    path: '/shelf/:uuid',
  },
  {
    component: Unit,
    path: '/books/search/:unitId',
  },
  {
    component: Unit,
    path: '/books/hidden/:unitId',
  },
  {
    component: Unit,
    path: '/books/:unitId',
  },
  {
    component: NotFound,
  },
];

export default function Routes() {
  return (
    <Switch>
      {routes.map(props => (
        <Route key={JSON.stringify(props)} {...props} />
      ))}
    </Switch>
  );
}
