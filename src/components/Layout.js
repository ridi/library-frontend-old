import { injectGlobal } from 'emotion';
import { globalReset } from './globalStyles';
import GNB from './GNB';
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
      <GNB />
      <div style={layoutStyle}>{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;
