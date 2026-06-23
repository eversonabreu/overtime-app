// AppShell — estrutura principal da aplicação autenticada.
// Contém a sidebar lateral, o header e a área de conteúdo.
// O "Outlet" do React Router renderiza a página atual dentro do shell —
// similar ao @Body no MainLayout do Blazor.

import { useState, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../store/AuthContext'
import Sidebar from './Sidebar'
import Header from './Header'

const AppShell = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Estado da sidebar: expandida ou retraída
  // No mobile começa retraída, no desktop expandida
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024)

  // Redireciona para troca de senha se for o primeiro acesso
  useEffect(() => {
    if (user?.isPasswordPendingReset) {
      navigate('/change-password', { replace: true })
    }
  }, [user, navigate])

  // Fecha a sidebar ao redimensionar para mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-primary)' }}>

      {/* Overlay escuro no mobile quando sidebar está aberta */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar lateral esquerda */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Área principal (header + conteúdo) */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Header fixo no topo */}
        <Header onToggleSidebar={() => setSidebarOpen(prev => !prev)} />

        {/* Área de conteúdo com scroll */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Outlet renderiza a página atual definida nas rotas do App.tsx */}
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AppShell
