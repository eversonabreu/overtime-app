// Header fixo no topo da aplicação.
// Contém o botão de abrir/fechar sidebar e informações contextuais.

import { FiMenu } from 'react-icons/fi'

interface HeaderProps {
  onToggleSidebar: () => void
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header
      className="flex items-center gap-4 px-4 lg:px-6 h-14 flex-shrink-0 border-b"
      style={{
        backgroundColor: 'var(--color-bg-secondary)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Botão hamburguer para abrir/fechar a sidebar */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg transition-colors"
        style={{ color: 'var(--color-text-secondary)' }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--color-border)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={20} />
      </button>

      {/* Espaço reservado para logo no header — opcional */}
      <div className="flex-1" />

      {/* Aqui podem ser adicionados: notificações, avatar, etc. */}
    </header>
  )
}

export default Header
