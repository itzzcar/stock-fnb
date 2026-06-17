import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email, password }) => {
    setServerError('');
    try {
      const user = await login(email, password);
      // Redirige al área correspondiente según el rol.
      navigate(user.role === 'admin' ? '/admin' : '/app');
    } catch (err) {
      setServerError(err.message);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h2 className="h4 mb-3 text-center">Iniciar sesión</h2>

              {serverError && <Alert variant="danger">{serverError}</Alert>}

              <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    isInvalid={!!errors.email}
                    {...register('email', { required: 'El email es obligatorio' })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    isInvalid={!!errors.password}
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" className="w-100" disabled={isSubmitting}>
                  {isSubmitting ? 'Entrando…' : 'Entrar'}
                </Button>
              </Form>

              <p className="text-center text-muted mt-3 mb-0 small">
                ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
              </p>
            </Card.Body>
          </Card>

          <Card className="mt-3 bg-light border-0">
            <Card.Body className="small text-muted">
              <strong>Credenciales de prueba</strong>
              <div>Admin: admin@bernabeu.com / admin123</div>
              <div>Usuario: user@bernabeu.com / user123</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
