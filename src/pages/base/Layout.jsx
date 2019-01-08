import { Global } from '@emotion/core';
import { globalStyles } from './styles';
import Footer from './Footer';
import GNB from './GNB';
import Toaster from '../../components/Toaster';

const Layout = ({ children }) => (
  <>
    <Global styles={globalStyles} />
    <GNB />
    {children}
    <Footer />
    <Toaster />
  </>
);

export default Layout;
