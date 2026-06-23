// Sidebar lateral com menu agrupado, perfil do usuário e alternância de tema.
// Auto-retrátil: no mobile some completamente, no desktop reduz para ícones.

import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../store/AuthContext'

// react-icons — biblioteca com milhares de ícones de vários packs.
// Prefixos: FiXxx = Feather Icons, MdXxx = Material Design, etc.
import {
  FiHome,
  FiClock,
  FiRefreshCw,
  FiUsers,
  FiSettings,
  FiCalendar,
  FiMapPin,
  FiLogOut,
  FiSun,
  FiMoon,
  FiX,
  FiChevronRight,
} from 'react-icons/fi'
import api from '../../services/api'
import { useAuth as useAuthHook } from '../../store/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

interface MenuItem {
  label: string
  icon: React.ReactNode
  to: string
  adminOnly?: boolean
}

interface MenuGroup {
  label?: string
  items: MenuItem[]
  adminOnly?: boolean
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation()
  const { user, logout, setUser } = useAuth()

  // Alternância de tema claro/escuro
  // Chama o backend para persistir a preferência e aplica na página
  const handleThemeToggle = async () => {
    if (!user) return
    const newTheme = !user.isBlackTheme
    document.documentElement.classList.toggle('dark', newTheme)
    setUser({ ...user, isBlackTheme: newTheme })

    // Persiste no banco via API
    await api.patch('/persons/theme', { isBlackTheme: newTheme })
  }

  // Define os grupos de menu conforme as rotas e permissões
  const menuGroups: MenuGroup[] = [
    {
      items: [
        { label: t('menu.home'), icon: <FiHome size={18} />, to: '/' },
        { label: t('menu.journeys'), icon: <FiClock size={18} />, to: '/journeys' },
        { label: t('menu.compensatory'), icon: <FiRefreshCw size={18} />, to: '/compensatory' },
      ],
    },
    {
      label: t('menu.configuration'),
      adminOnly: true,
      items: [
        { label: t('menu.persons'), icon: <FiUsers size={18} />, to: '/persons', adminOnly: true },
        { label: t('menu.groups'), icon: <FiUsers size={18} />, to: '/groups', adminOnly: true },
        { label: t('menu.holidays'), icon: <FiCalendar size={18} />, to: '/holidays', adminOnly: true },
        { label: t('menu.locations'), icon: <FiMapPin size={18} />, to: '/locations', adminOnly: true },
      ],
    },
  ]

  // Perfil do usuário exibido na sidebar
  const profileLabel = user?.isAdmin
    ? t('profile.admin')
    : user?.isLeader
      ? t('profile.leader')
      : null

  return (
    <>
      {/* Sidebar — transição suave de abertura/fechamento */}
      <aside
        className="fixed lg:relative z-30 h-full flex flex-col transition-all duration-300 ease-in-out"
        style={{
          width: isOpen ? '240px' : '0px',
          minWidth: isOpen ? '240px' : '0px',
          backgroundColor: 'var(--color-bg-sidebar)',
          overflow: 'hidden',
        }}
      >
        <div className="flex flex-col h-full w-[240px]">

          {/* Logo e botão de fechar (mobile) */}
          <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Espaço reservado para a logo */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                OT
              </div>
              <span className="text-white font-semibold text-sm">Overtime</span>
            </div>
            {/* Botão de fechar só aparece no mobile */}
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <FiX size={18} />
            </button>
          </div>

          {/* Perfil do usuário */}
          <div className="px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              {/* Avatar com iniciais do nome */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                {/* Perfil só aparece se for admin ou líder */}
                {profileLabel && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-sidebar)', opacity: 0.7 }}>
                    {profileLabel}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Itens de menu */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            {menuGroups.map((group, groupIndex) => {
              // Esconde grupos admin-only para não-admins
              if (group.adminOnly && !user?.isAdmin) return null

              const visibleItems = group.items.filter(
                item => !item.adminOnly || user?.isAdmin
              )
              if (visibleItems.length === 0) return null

              return (
                <div key={groupIndex}>
                  {/* Label do grupo (ex: "Configuração") */}
                  {group.label && (
                    <p className="text-xs uppercase font-semibold px-2 mb-2"
                      style={{ color: 'var(--color-text-sidebar)', opacity: 0.5 }}>
                      {group.label}
                    </p>
                  )}
                  <ul className="space-y-1">
                    {visibleItems.map(item => (
                      <li key={item.to}>
                        {/* NavLink aplica classe "active" automaticamente
                            quando a URL atual corresponde ao "to" */}
                        <NavLink
                          to={item.to}
                          end={item.to === '/'}
                          onClick={() => window.innerWidth < 1024 && onClose()}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                              isActive
                                ? 'text-white'
                                : 'text-gray-400 hover:text-white'
                            }`
                          }
                          style={({ isActive }) => ({
                            backgroundColor: isActive
                              ? 'var(--color-bg-sidebar-hover)'
                              : 'transparent',
                          })}
                        >
                          {item.icon}
                          <span className="truncate">{item.label}</span>
                          {({ isActive }: { isActive: boolean }) => isActive && (
                            <FiChevronRight size={14} className="ml-auto" />
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </nav>

          {/* Rodapé da sidebar — tema e logout */}
          <div className="px-3 py-3 border-t border-white/10 space-y-1">
            {/* Botão de alternância de tema */}
            <button
              onClick={handleThemeToggle}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-sidebar-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {user?.isBlackTheme ? <FiSun size={18} /> : <FiMoon size={18} />}
              <span>{user?.isBlackTheme ? t('theme.light') : t('theme.dark')}</span>
            </button>

            {/* Botão de logout */}
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition-colors"
              style={{ backgroundColor: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-bg-sidebar-hover)')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <FiLogOut size={18} />
              <span>{t('menu.logout')}</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  )
}

export default Sidebar
