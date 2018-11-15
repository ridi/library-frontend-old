import Header from './Header';

import Toaster from './Toaster';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = ({ children }) => (
  <div style={layoutStyle}>
    <Header />
    {children}
    <Toaster />
  </div>
);

export default Layout;
