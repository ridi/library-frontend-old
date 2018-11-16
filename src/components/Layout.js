import '../styles';
import ConnectedLNB from './lnb';
import Footer from './Footer';
import GNB from './GNB';
import Toaster from './Toaster';

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
