import React from 'react';
import Helmet from 'react-helmet';
import { initializeApi } from './api';
import { initializeSentry } from './utils/sentry';
import { initializeTabKeyFocus, registerTabKeyUpEvent, registerMouseDownEvent } from './utils/tabFocus';

import Routes from './Routes';
import Favicon from './pages/base/Favicon';
import Layout from './pages/base/Layout';

export default function App() {
  React.useEffect(() => {
    initializeTabKeyFocus();
    initializeSentry();
    const body = document.querySelector('body');
    const disposeBag = [];
    disposeBag.push(registerTabKeyUpEvent(body));
    disposeBag.push(registerMouseDownEvent(body));
    return () => {
      for (const callback of disposeBag) {
        callback();
      }
    };
  }, []);

  return (
    <>
      <Favicon />
      <Layout>
        <Routes />
      </Layout>
    </>
  );
}
