import Footer from './Footer';
import GNB from './GNB';
import Toaster from '../../components/Toaster';

const Layout = ({ children }) => (
  <>
    <GNB />
    {children}
    <Footer />
    <Toaster />
  </>
);

export default Layout;
