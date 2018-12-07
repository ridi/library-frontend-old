/** @jsx jsx */
import { Global, jsx } from '@emotion/core';
import Footer from './Footer';
import GNB from './GNB';
import { reset } from '../../styles/reset';
import Toaster from '../../components/Toaster';

const Layout = ({ children }) => (
  <>
    <Global styles={reset} />
    <GNB />
    {children}
    <Footer />
    <Toaster />
  </>
);

export default Layout;
