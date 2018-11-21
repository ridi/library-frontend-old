import { hydrate, injectGlobal } from 'react-emotion';
import React from 'react';

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
    <GNB />
    {children}
    <Footer />
    <Toaster />
  </>
);

export default Layout;
