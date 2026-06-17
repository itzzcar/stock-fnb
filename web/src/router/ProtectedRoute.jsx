import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Envuelve rutas privadas.
// - Si no hay sesión -> redirige a /login.
// - Si requireAdmin y el usuario no es admin -> redirige a /app.
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // evita parpadeo mientras se valida el token

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/app" replace />;
  }
  return children;
}
