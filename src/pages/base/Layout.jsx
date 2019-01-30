import { Global } from '@emotion/core';
import { globalStyles } from './styles';
import GNB from './GNB';
import Toaster from '../../components/Toaster';

const Layout = ({ children }) => (
  <>
    <Global styles={globalStyles} />
    <GNB />
    {children}
    <Toaster />
  </>
);

export default Layout;
