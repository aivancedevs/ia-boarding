import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User, LoginCredentials } from '@/types';
import { storage } from '@/utils/helpers';
import { login as loginApi } from '@/api/authApi';
import { ROUTES } from '@/utils/constants';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = () => {
      console.log('🔄 Inicializando auth...');
      const storedToken = storage.getToken();
      const storedUser = storage.getUser();

      console.log('💾 Token almacenado:', storedToken);
      console.log('💾 User almacenado:', storedUser);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        console.log('✅ Auth restaurada desde localStorage');
      } else {
        console.log('❌ No hay auth en localStorage');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      
      console.log('🔐 Iniciando login con:', credentials.email);
      const response = await loginApi(credentials);
      console.log('📦 Response completa:', response);
      
      const { user: userData, token: authToken } = response;

      console.log('👤 User extraído:', userData);
      console.log('🔑 Token extraído:', authToken);

      if (!userData || !authToken) {
        throw new Error('Respuesta inválida: falta user o token');
      }

      storage.setToken(authToken);
      storage.setUser(userData);

      console.log('💾 Guardado en localStorage');
      console.log('💾 Verificación - Token:', storage.getToken());
      console.log('💾 Verificación - User:', storage.getUser());

      setToken(authToken);
      setUser(userData);
      
      console.log('⚛️ Estado actualizado en React');
      
      setLoading(false);

      console.log('📍 Navegando a:', ROUTES.DASHBOARD);

      setTimeout(() => {
        navigate(ROUTES.DASHBOARD, { replace: true });
        console.log('✅ Navegación ejecutada');
      }, 0);
      
    } catch (error) {
      setLoading(false);
      console.error('❌ Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión');
    storage.clear();
    setToken(null);
    setUser(null);
    navigate(ROUTES.LOGIN);
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token && !!user,
  };

  console.log('🔍 AuthProvider render:', { user, token, loading, isAuthenticated: !!token && !!user });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};