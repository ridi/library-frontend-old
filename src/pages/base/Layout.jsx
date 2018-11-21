import Head from 'next/head';
import { hydrate, injectGlobal } from 'react-emotion';
import React from 'react';

import Favicon from './Favicon';
import Footer from './Footer';
import GNB from './GNB';
import { reset } from '../../styles/reset';
import Toaster from '../../components/Toaster';

injectGlobal(reset);
if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.ids);
}

const Layout = ({ children }) => (
  <>
    <Head>
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      <title>내 서재 - 리디북스</title>
      <Favicon />
    </Head>
    <GNB />
    {children}
    <Footer />
    <Toaster />
  </>
);

export default Layout;
