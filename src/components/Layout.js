import { injectGlobal } from 'emotion';
import { globalReset } from './globalStyles';
import Header from './Header';
import Footer from './Footer';

injectGlobal(globalReset);

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = props => {
  const { children } = props;
  return (
    <div className="Library">
      <Header />
      <div style={layoutStyle}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
