import Link from 'next/link';

const linkStyle = {
  marginRight: 15,
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href={{ pathname: '/about', query: { keyword: '123' } }}>
      <a style={linkStyle}>About</a>
    </Link>
  </div>
);

export default Header;
