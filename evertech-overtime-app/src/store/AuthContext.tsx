// Context de autenticação — equivalente a um serviço global no .NET.
// No React, o "Context" é a forma de compartilhar estado entre
// componentes sem precisar passar props manualmente (prop drilling).
// Pense nele como um "singleton" acessível em qualquer componente.

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { useTranslation } from 'react-i18next';
import authService from '../services/auth.service';
import type { AuthUser, LoginRequest } from '../types/auth.types';
import i18n from '../i18n';
import config from '../config/config';

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser) => void;
}

// Cria o contexto com valor inicial undefined
// O "!" no final diz ao TypeScript para confiar que o valor
// sempre existirá quando usado dentro do AuthProvider
const AuthContext = createContext<AuthContextData>(undefined!);

// Hook customizado para acessar o contexto.
// Similar a injetar IAuthService via construtor no .NET.
// Uso: const { user, login } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Provider — componente que envolve a aplicação e fornece o contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { i18n: i18nInstance } = useTranslation();

  // useState é o hook para estado local/global.
  // Similar a uma propriedade com notificação de mudança no Blazor.
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (request: LoginRequest) => {
    const { user: loggedUser } = await authService.login(request);
    setUser(loggedUser);

    // Aplica o tema do usuário ao body da página
    if (loggedUser.isBlackTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Aplica o idioma padrão do sistema (não é por usuário,
    // é a configuração global do frontend)
    await i18nInstance.changeLanguage(config.defaultLanguage);
  }, [i18nInstance]);

  const logout = useCallback(async () => {
    await authService.revoke();
    setUser(null);
    // Redireciona para login — o React Router vai tratar isso
    window.location.href = '/login';
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      setUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
