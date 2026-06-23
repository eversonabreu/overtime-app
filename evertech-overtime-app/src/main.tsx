// Ponto de entrada da aplicação React.
// Equivalente ao Program.cs no .NET —
// aqui configuramos os "providers" globais (DI do React).

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

// Importa a configuração do i18n antes de qualquer coisa
// para garantir que as traduções estejam disponíveis
import './i18n'
import './index.css'

import { AuthProvider } from './store/AuthContext'
import App from './App'

// QueryClient gerencia o cache das chamadas à API.
// Similar ao IMemoryCache do .NET, mas focado em dados de servidor.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Não refaz a chamada automaticamente em caso de erro
      retry: false,
      // Considera os dados "frescos" por 1 minuto
      staleTime: 1000 * 60,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter habilita o roteamento baseado em URL */}
    <BrowserRouter>
      {/* QueryClientProvider disponibiliza o cache para toda a app */}
      <QueryClientProvider client={queryClient}>
        {/* AuthProvider disponibiliza o usuário logado para toda a app */}
        <AuthProvider>
          <App />
          {/* Toaster renderiza as notificações (400/422) no canto da tela */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 8000,
              style: {
                borderRadius: '8px',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)
