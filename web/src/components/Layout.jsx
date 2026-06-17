import { Container } from 'react-bootstrap';
import NavBar from './NavBar';

// Estructura común de las páginas privadas: navbar + contenido centrado.
export default function Layout({ children }) {
  return (
    <>
      <NavBar />
      <Container className="py-4">{children}</Container>
    </>
  );
}
