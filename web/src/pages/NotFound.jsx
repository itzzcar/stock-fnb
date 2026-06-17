import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar';

export default function NotFound() {
  return (
    <>
      <NavBar />
      <Container className="py-5 text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="lead text-muted">La página que buscas no existe.</p>
        <Button as={Link} to="/">
          Volver al inicio
        </Button>
      </Container>
    </>
  );
}
