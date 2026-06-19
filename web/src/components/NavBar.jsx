import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar expand="lg" variant="dark" className="navbar-brand-custom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Stock F&amp;B
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link as={Link} to="/app" active={location.pathname === '/app'}>
                Inventario
              </Nav.Link>
            )}
            {isAdmin && (
              <Nav.Link as={Link} to="/admin" active={location.pathname === '/admin'}>
                Administración
              </Nav.Link>
            )}
          </Nav>
          <Nav className="align-items-lg-center">
            {isAuthenticated ? (
              <>
                <span className="text-light me-3">
                  {user.name}{' '}
                  <Badge bg={isAdmin ? 'warning' : 'secondary'} text={isAdmin ? 'dark' : undefined}>
                    {user.role}
                  </Badge>
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Entrar
                </Nav.Link>
                <Button as={Link} to="/register" variant="light" size="sm" className="ms-lg-2">
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
