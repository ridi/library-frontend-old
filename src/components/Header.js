import Link from 'next/link';

const linkStyle = {
  marginRight: 10,
  fontFamily: 'sans-serif',
  color: '#666',
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href={{ pathname: '/about', query: { keyword: '123' } }}>
      <a style={linkStyle}>About</a>
    </Link>
    <Link href="/hidden">
      <a style={linkStyle}>숨김 페이지</a>
    </Link>
  </div>
);

export default Header;
