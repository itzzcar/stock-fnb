import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <NavBar />
      <Container className="py-5">
        <Row className="justify-content-center text-center">
          <Col md={8} lg={6}>
            <h1 className="display-5 fw-bold mb-3">Gestión de Stock F&amp;B</h1>
            <p className="lead text-muted mb-4">
              Control de inventario de Food &amp; Beverage en tiempo real: niveles de
              stock, movimientos y administración de productos.
            </p>
            <div className="d-flex gap-2 justify-content-center flex-wrap">
              {isAuthenticated ? (
                <Button as={Link} to="/app" size="lg">
                  Ir al inventario
                </Button>
              ) : (
                <>
                  <Button as={Link} to="/login" size="lg">
                    Iniciar sesión
                  </Button>
                  <Button as={Link} to="/register" size="lg" variant="outline-primary">
                    Crear cuenta
                  </Button>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
