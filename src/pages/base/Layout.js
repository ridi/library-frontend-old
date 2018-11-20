import React from 'react';
import Head from 'next/head';
import '../../styles';
import ConnectedLNB from '../../components/lnb';
import Toaster from '../../components/Toaster';
import Footer from './Footer';
import GNB from './GNB';

const Layout = ({ children }) => (
  <>
    <Head>
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0" />
      <title>내 서재 - 리디북스</title>
    </Head>
    <GNB />
    <ConnectedLNB />
    {children}
    <Footer />
    <Toaster />
  </>
);

export default Layout;
