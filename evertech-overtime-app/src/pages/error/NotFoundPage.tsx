import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FiAlertTriangle } from 'react-icons/fi'

const NotFoundPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}>
      <FiAlertTriangle size={64} style={{ color: 'var(--color-warning)' }} />
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>404</h1>
        <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
          {t('common.notFound')}
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

export default NotFoundPage
