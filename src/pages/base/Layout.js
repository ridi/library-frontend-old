import '../../styles';
import ConnectedLNB from '../../components/lnb';
import Toaster from '../../components/Toaster';
import Footer from './Footer';
import GNB from './GNB';

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
