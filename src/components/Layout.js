import ConnectedGNB from './gnb';
import ConnectedLNB from './lnb';
import Toaster from './Toaster';
import Footer from './footer';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = ({ children }) => (
  <div style={layoutStyle}>
    <ConnectedGNB />
    <ConnectedLNB />
    {children}
    <Footer />
    <Toaster />
  </div>
);

export default Layout;
