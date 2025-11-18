import { Link } from 'react-router-dom';

function Header() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/create">Create</Link>
    </nav>
  );
}

export default Header;
