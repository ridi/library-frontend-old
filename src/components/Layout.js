import ConnectedLNB from './lnb';
import Toaster from './Toaster';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = ({ children }) => (
  <div style={layoutStyle}>
    <ConnectedLNB />
    {children}
    <Toaster />
  </div>
);

export default Layout;
