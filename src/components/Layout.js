import { injectGlobal } from 'emotion';
import { globalReset } from './globalStyles';

import ConnectedLNB from './lnb';
import Footer from './Footer';
import GNB from './GNB';
import Toaster from './Toaster';

injectGlobal(globalReset);

const Layout = ({ children }) => (
  <div>
    <GNB />
    <ConnectedLNB />
    {children}
    <Footer />
    <Toaster />
  </div>
);

export default Layout;
