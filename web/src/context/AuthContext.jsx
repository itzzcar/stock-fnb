import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { tokenStorage } from '../services/apiClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, si hay token guardado intentamos recuperar el usuario.
  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setLoading(false);
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => tokenStorage.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user } = await authService.login(email, password);
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const { token, user } = await authService.register(name, email, password);
    tokenStorage.set(token);
    setUser(user);
    return user;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook para consumir el contexto cómodamente.
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
