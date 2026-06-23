// Página de troca de senha obrigatória.
// Exibida automaticamente pelo AppShell quando
// user.isPasswordPendingReset === true.
// O usuário não pode acessar nenhuma outra página antes de trocar a senha.

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { isAxiosError } from 'axios'
import { useAuth } from '../../store/AuthContext'
import api from '../../services/api'

const schema = z.object({
  currentPassword: z.string().min(1, 'A senha atual é obrigatória.'),
  newPassword: z.string().min(8, 'A nova senha deve ter no mínimo 8 caracteres.'),
  confirmPassword: z.string().min(1, 'Confirme a nova senha.'),
}).refine(data => data.newPassword === data.confirmPassword, {
  // "refine" permite validações cruzadas entre campos —
  // equivalente a um IValidationRule do FluentValidation
  message: 'As senhas não conferem.',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

const ChangePasswordPage = () => {
  const { t } = useTranslation()
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!user) return
    setIsLoading(true)

    try {
      await api.patch('/persons/change-password', {
        personId: user.personId,
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      // Atualiza o estado global removendo o flag de senha pendente
      setUser({ ...user, isPasswordPendingReset: false })
      toast.success('Senha alterada com sucesso!')
      navigate('/', { replace: true })
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) {
          const errors: string[] = error.response?.data?.errors ?? []
          errors.forEach(msg => toast.error(msg, {
            style: { borderLeft: '4px solid #ef4444' }
          }))
        } else if (status === 422) {
          const message: string = error.response?.data?.message ?? 'Erro desconhecido.'
          toast.error(message, {
            style: { borderLeft: '4px solid #f59e0b' }
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Helper para renderizar campos de senha com toggle de visibilidade
  const PasswordField = ({
    label,
    fieldName,
    show,
    onToggle,
    error,
  }: {
    label: string
    fieldName: keyof FormData
    show: boolean
    onToggle: () => void
    error?: string
  }) => (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
        {label}
      </label>
      <div className="relative">
        <FiLock size={16} className="absolute left-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--color-text-secondary)' }} />
        <input
          {...register(fieldName)}
          type={show ? 'text' : 'password'}
          placeholder="••••••••"
          className="w-full pl-9 pr-10 py-2.5 rounded-lg border text-sm outline-none"
          style={{
            backgroundColor: 'var(--color-bg-primary)',
            borderColor: error ? 'var(--color-danger)' : 'var(--color-border)',
            color: 'var(--color-text-primary)',
          }}
        />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: 'var(--color-text-secondary)' }}>
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      </div>
      {error && <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>{error}</p>}
    </div>
  )

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
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mb-4"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            OT
          </div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            {t('auth.changePasswordTitle')}
          </h1>
          <p className="text-sm mt-1 text-center" style={{ color: 'var(--color-text-secondary)' }}>
            {t('auth.changePasswordDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordField
            label={t('auth.currentPassword')}
            fieldName="currentPassword"
            show={showCurrent}
            onToggle={() => setShowCurrent(p => !p)}
            error={errors.currentPassword?.message}
          />
          <PasswordField
            label={t('auth.newPassword')}
            fieldName="newPassword"
            show={showNew}
            onToggle={() => setShowNew(p => !p)}
            error={errors.newPassword?.message}
          />
          <PasswordField
            label={t('auth.confirmPassword')}
            fieldName="confirmPassword"
            show={showConfirm}
            onToggle={() => setShowConfirm(p => !p)}
            error={errors.confirmPassword?.message}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-opacity disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent)' }}
          >
            {isLoading ? t('common.loading') : t('auth.changePassword')}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordPage
