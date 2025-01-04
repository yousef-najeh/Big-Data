import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav
      style={{
        padding: '15px',
        backgroundColor: '#e3f2fd',
        display: 'flex',
        justifyContent: 'center', // Center items horizontally
        alignItems: 'center',
      }}
    >
      <Link
        to="/"
        style={{
          margin: '0 20px',
          color: 'blue',
          fontSize: '24px',
          textDecoration: 'none', // Removes underline
        }}
      >
        Dashboard
      </Link>
      <Link
        to="/search"
        style={{
          margin: '0 20px',
          color: 'blue',
          fontSize: '24px',
          textDecoration: 'none', // Removes underline
        }}
      >
        Search Page
      </Link>
    </nav>
  );
};

export default Navbar;
