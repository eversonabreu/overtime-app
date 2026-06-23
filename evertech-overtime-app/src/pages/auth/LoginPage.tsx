import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../store/AuthContext'
import { isAxiosError } from 'axios'

const loginSchema = z.object({
  credential: z.string().min(1, 'O e-mail ou matrícula é obrigatório.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      await login(data)
      navigate('/', { replace: true })
    } catch (error) {
      if (isAxiosError(error)) {
        const status = error.response?.status
        if (status === 400) {
          const errs: string[] = error.response?.data?.errors ?? []
          errs.forEach(msg => toast.error(msg, { style: { borderLeft: '4px solid #ef4444' } }))
        } else if (status === 422) {
          const message: string = error.response?.data?.message ?? 'Erro desconhecido.'
          toast.error(message, { style: { borderLeft: '4px solid #f59e0b' } })
        } else {
          navigate('/500')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      backgroundColor: 'var(--color-bg-primary)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        padding: '40px 32px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'var(--color-accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px',
            marginBottom: '16px',
          }}>
            OT
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-text-primary)', margin: 0 }}>
            {t('auth.title')}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '6px' }}>
            Overtime — Controle de Jornada Extra
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Campo: e-mail ou matrícula */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              {t('auth.credential')}
            </label>
            <div style={{ position: 'relative' }}>
              <FiUser size={15} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none',
              }} />
              <input
                {...register('credential')}
                type="text"
                autoComplete="username"
                placeholder="seu@email.com ou matrícula"
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 38px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.credential ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            {errors.credential && (
              <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>
                {errors.credential.message}
              </p>
            )}
          </div>

          {/* Campo: senha */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              {t('auth.password')}
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock size={15} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-secondary)',
                pointerEvents: 'none',
              }} />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '10px 42px 10px 38px',
                  borderRadius: '8px',
                  border: `1px solid ${errors.password ? 'var(--color-danger)' : 'var(--color-border)'}`,
                  backgroundColor: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Link esqueci minha senha */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/forgot-password" style={{ fontSize: '13px', color: 'var(--color-accent)', textDecoration: 'none' }}>
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* Botão login */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '11px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-accent)',
              color: 'white',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {isLoading ? t('common.loading') : t('auth.login')}
          </button>

        </form>
      </div>
    </div>
  )
}

export default LoginPage
