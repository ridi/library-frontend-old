import Header from './Header';

import Toast from './Toast';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = ({ children }) => (
  <div style={layoutStyle}>
    <Header />
    {children}
    <Toast />
  </div>
);

export default Layout;
