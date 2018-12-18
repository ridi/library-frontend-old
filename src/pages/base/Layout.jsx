import { Global } from '@emotion/core';
import { reset } from '../../styles/reset';
import Footer from './Footer';
import GNB from './GNB';
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
