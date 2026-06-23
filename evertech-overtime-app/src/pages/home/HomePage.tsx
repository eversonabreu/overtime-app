// Página inicial / Dashboard.
// Cada perfil verá informações diferentes:
// Admin → visão geral do sistema
// Líder → foco nos grupos que lidera
// Usuário comum → foco nos próprios dados
// TODO: implementar gráficos e dados reais

import { useTranslation } from 'react-i18next'
import { useAuth } from '../../store/AuthContext'
import { FiClock, FiUsers, FiRefreshCw, FiCalendar } from 'react-icons/fi'

// Componente de card simples para o dashboard
const DashboardCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode
  title: string
  value: string
}) => (
  <div
    className="rounded-xl p-5 flex items-center gap-4 border"
    style={{
      backgroundColor: 'var(--color-bg-secondary)',
      borderColor: 'var(--color-border)',
    }}
  >
    <div
      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: 'var(--color-accent)', opacity: 0.9 }}
    >
      <span className="text-white">{icon}</span>
    </div>
    <div>
      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{title}</p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--color-text-primary)' }}>{value}</p>
    </div>
  </div>
)

const HomePage = () => {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="space-y-6">

      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          Bem-vindo(a) ao Overtime — Sistema de Controle de Jornada Extra de Trabalho
        </p>
      </div>

      {/* Cards de resumo — TODO: conectar com dados reais da API */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <DashboardCard
          icon={<FiClock size={22} />}
          title="Horas extras no mês"
          value="—"
        />
        <DashboardCard
          icon={<FiRefreshCw size={22} />}
          title="Saldo banco de horas"
          value="—"
        />

        {/* Cards exclusivos para Admin */}
        {user?.isAdmin && (
          <>
            <DashboardCard
              icon={<FiUsers size={22} />}
              title="Colaboradores ativos"
              value="—"
            />
            <DashboardCard
              icon={<FiCalendar size={22} />}
              title="Grupos ativos"
              value="—"
            />
          </>
        )}

        {/* Cards exclusivos para Líder (não admin) */}
        {user?.isLeader && !user?.isAdmin && (
          <DashboardCard
            icon={<FiUsers size={22} />}
            title="Meus liderados"
            value="—"
          />
        )}
      </div>

      {/* Área de gráficos — TODO: implementar com dados reais */}
      <div
        className="rounded-xl border p-6 flex items-center justify-center min-h-[200px]"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
          borderStyle: 'dashed',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          📊 Gráficos serão implementados aqui
        </p>
      </div>

    </div>
  )
}

export default HomePage
