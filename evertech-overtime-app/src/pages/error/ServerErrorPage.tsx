import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FiAlertOctagon } from 'react-icons/fi'

const ServerErrorPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <FiAlertOctagon size={64} style={{ color: 'var(--color-danger)' }} />
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>500</h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          {t('common.error')}
        </p>
      </div>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 rounded-lg text-white text-sm font-medium transition-colors"
        style={{ backgroundColor: 'var(--color-accent)' }}
      >
        Voltar ao início
      </button>
    </div>
  )
}

export default ServerErrorPage
