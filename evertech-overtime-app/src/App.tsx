// Componente raiz da aplicação com roteamento.
// No React Router, definimos as "rotas" aqui —
// similar ao @page do Blazor ou ao RouterModule do Angular.

import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './store/AuthContext'

// Layouts
import AppShell from './components/layout/AppShell'

// Páginas públicas
import LoginPage from './pages/auth/LoginPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'

// Páginas protegidas
import HomePage from './pages/home/HomePage'
import NotFoundPage from './pages/error/NotFoundPage'
import ServerErrorPage from './pages/error/ServerErrorPage'
import ChangePasswordPage from './pages/auth/ChangePasswordPage'

// Componente de rota protegida — redireciona para login
// se o usuário não estiver autenticado.
// Similar ao [Authorize] do ASP.NET Core.
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// Rota pública — redireciona para home se já estiver logado
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}

const App = () => {
  return (
    <Routes>
      {/* ── Rotas públicas ─────────────────────────────────────────── */}
      <Route path="/login" element={
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      } />

      <Route path="/forgot-password" element={
        <PublicRoute>
          <ForgotPasswordPage />
        </PublicRoute>
      } />

      {/* ── Rotas protegidas (dentro do AppShell com sidebar) ──────── */}
      <Route path="/" element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        {/* Rota index — página inicial / dashboard */}
        <Route index element={<HomePage />} />

        {/* Troca de senha obrigatória (IsPasswordPendingReset) */}
        <Route path="change-password" element={<ChangePasswordPage />} />

        {/* TODO: adicionar rotas de jornadas, grupos, feriados etc. */}
      </Route>

      {/* ── Páginas de erro ────────────────────────────────────────── */}
      <Route path="/500" element={<ServerErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
