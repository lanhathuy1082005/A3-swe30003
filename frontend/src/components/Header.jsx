import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';

function Header({user, setUser, isLoggedin, setIsLoggedin, warningCounter}) {

  const navigate = useNavigate()

  const handleLogout = async () => {
    try{

      await fetch("http://localhost:3000/user/logout",{method: 'POST', credentials: 'include'});
      setIsLoggedin(false);
      setUser({})
      navigate("/login");

    } catch(err){

      console.error(err);
    }
  }

  return (
<>
    <Navbar expand="lg" className="bg-body-tertiary">
        <Navbar.Brand as={Link} to="/">HC-CMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/order">Order{user.permissions && user.permissions.includes("edit_menu") && warningCounter > 0 && <Badge>{warningCounter}</Badge>}</Nav.Link>
            {isLoggedin ? 
            (<NavDropdown title={`Welcome, ${user.name}`} id="basic-nav-dropdown">
              <NavDropdown.Item>History</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>) : 
            (<Nav.Link as={Link} to="/login">Login</Nav.Link>)}
          </Nav>
        </Navbar.Collapse>
    </Navbar>
</>
  );
}

export default Header;
