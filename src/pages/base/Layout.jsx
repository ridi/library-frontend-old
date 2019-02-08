import { Global } from '@emotion/core';
import { globalStyles } from './styles';
import GNB from './GNB';
import Toaster from '../../components/Toaster';
import FullScreenLoading from '../../components/FullScreenLoading';

const Layout = ({ children }) => (
  <>
    <Global styles={globalStyles} />
    <GNB />
    {children}
    <Toaster />
    <FullScreenLoading />
  </>
);

export default Layout;
