import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi'
import api from '../../services/api'
import { isAxiosError } from 'axios'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Informe um e-mail válido.').min(1, 'O e-mail é obrigatório.'),
})

type FormData = z.infer<typeof schema>

const ForgotPasswordPage = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      await api.patch('/persons/request-password-reset', data)
      // Sempre mostramos a mensagem de sucesso, mesmo se o e-mail
      // não existir — por segurança (não confirmamos se o e-mail existe)
      setSent(true)
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 400) {
        const errors: string[] = error.response?.data?.errors ?? []
        errors.forEach(msg => toast.error(msg, {
          style: { borderLeft: '4px solid #ef4444' }
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--color-bg-primary)' }}
    >
      <div
        className="w-full max-w-md rounded-2xl shadow-xl p-8 border"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            OT
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {t('auth.forgotPasswordTitle')}
          </h1>
          <p className="text-sm mt-1 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            {t('auth.forgotPasswordDescription')}
          </p>
        </div>

        {/* Estado: e-mail enviado */}
        {sent ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <FiCheckCircle size={48} style={{ color: 'var(--color-success)' }} />
            <p className="text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
              {t('auth.resetEmailSent')}
            </p>
            <Link
              to="/login"
              className="text-sm font-medium"
              style={{ color: 'var(--color-accent)' }}
            >
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-text-primary)' }}
              >
                {t('auth.email')}
              </label>
              <div className="relative">
                <FiMail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--color-text-secondary)' }}
                />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-bg-primary)',
                    borderColor: errors.email ? 'var(--color-danger)' : 'var(--color-border)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-60"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {isLoading ? t('common.loading') : t('auth.sendResetEmail')}
            </button>

            <Link
              to="/login"
              className="flex items-center justify-center gap-2 text-sm mt-2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              <FiArrowLeft size={14} />
              Voltar ao login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
