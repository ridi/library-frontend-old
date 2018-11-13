import GNB from './GNB';
import Footer from './Footer';
import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD',
};

const Layout = props => {
  const { children } = props;
  return (
    <div>
      <GNB />
      <div style={layoutStyle}>
        <Header />
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
