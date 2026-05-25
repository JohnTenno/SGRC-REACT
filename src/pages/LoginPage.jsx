import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconEye, IconEyeSlash } from '@/components/icons'
import { LoginImageCarousel } from '@/components/auth/LoginImageCarousel'
import { saveAuthSession } from '@/lib/authSession'
import escudoUach from '@/assets/escudo-color.png'

const labelClass =
  'font-alverata text-sm font-semibold uppercase tracking-[0.12em] text-white/95'

const subtitleClass = 'font-alverata text-base font-medium text-white/80'

const bodyTextClass = 'font-praxis text-sm text-white/70'

function buildLoginRequestBody(enrollment, password) {
  return { enrollment: enrollment.trim(), password }
}

async function login(requestBody) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw { status: response.status, message: data?.message ?? 'Matrícula o contraseña incorrectos.' }
  }

  return data
}

function validate({ enrollment, password }) {
  const errors = {}
  const trimmed = enrollment.trim()

  if (!trimmed) {
    errors.enrollment = 'La matrícula es obligatoria.'
  } else if (!/^[a-zA-Z0-9]{3,20}$/.test(trimmed)) {
    errors.enrollment = 'Ingresa una matrícula válida.'
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria.'
  }

  return errors
}

function inputClass(hasError, extra = '') {
  return `input-field ${extra} ${hasError ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30' : ''}`
}

const loginBackdropPurple = '#1e0f3a'

export function LoginPage() {
  const navigate = useNavigate()
  const [enrollment, setEnrollment] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const prevHtml = document.documentElement.style.backgroundColor
    const prevBody = document.body.style.backgroundColor
    document.documentElement.style.backgroundColor = loginBackdropPurple
    document.body.style.backgroundColor = loginBackdropPurple
    return () => {
      document.documentElement.style.backgroundColor = prevHtml
      document.body.style.backgroundColor = prevBody
    }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate({ enrollment, password })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setFormError(null)
    setIsSubmitting(true)

    try {
      const data = await login(buildLoginRequestBody(enrollment, password))
      saveAuthSession({ token: data.token, user: data.user })
      navigate('/home', { replace: true })
    } catch (error) {
      if (error.status === 401) {
        setFieldErrors({ password: 'Matrícula o contraseña incorrectos.' })
        setPassword('')
      } else {
        setFormError('No se pudo conectar con el servidor. Intenta de nuevo.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-uach-purple-950">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-uach-purple-950"
      />
      <main className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <LoginImageCarousel className="hidden shrink-0 lg:block lg:min-h-screen lg:w-1/2" />

        <section className="relative flex w-full flex-1 items-center justify-center bg-uach-purple-950 px-4 py-10 lg:w-1/2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-uach-purple-600/40 blur-3xl"
          />
          <div className="relative z-10 w-full max-w-lg">
            <header className="mb-10 text-center">
              <img
                src={escudoUach}
                alt="Escudo Universidad Autónoma de Chihuahua"
                className="mx-auto mb-5 h-28 w-auto object-contain lg:h-32"
              />
              <p className="font-alverata mb-3 text-sm font-semibold tracking-[0.2em] text-uach-gold-400 uppercase">
                Universidad Autónoma de Chihuahua
              </p>
              <h1 className="font-alverata text-4xl font-semibold tracking-tight text-white lg:text-[2.75rem] lg:leading-tight">
                SISTEMA DE GESTIÓN DE RESERVA
              </h1>
              <p className={`mt-3 ${subtitleClass}`}>
                Ingresa con tu matrícula institucional
              </p>
            </header>

            <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col gap-2">
                <label htmlFor="enrollment" className={labelClass}>
                  Matrícula institucional
                </label>
                <input
                  id="enrollment"
                  name="enrollment"
                  type="text"
                  inputMode="text"
                  autoComplete="username"
                  placeholder="Número de matrícula"
                  value={enrollment}
                  onChange={(e) => {
                    setEnrollment(e.target.value)
                    setFieldErrors((prev) => ({ ...prev, enrollment: undefined }))
                    setFormError(null)
                  }}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.enrollment)}
                  aria-describedby={fieldErrors.enrollment ? 'enrollment-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.enrollment))}
                />
                {fieldErrors.enrollment ? (
                  <p id="enrollment-error" className="font-praxis text-sm text-red-300">
                    {fieldErrors.enrollment}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className={labelClass}>
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Contraseña de acceso"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setFieldErrors((prev) => ({ ...prev, password: undefined }))
                      setFormError(null)
                    }}
                    disabled={isSubmitting}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    className={inputClass(Boolean(fieldErrors.password), 'pr-12')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    disabled={isSubmitting}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uach-gold-400/60 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <IconEyeSlash className="size-5" aria-hidden />
                    ) : (
                      <IconEye className="size-5" aria-hidden />
                    )}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p id="password-error" className="font-praxis text-sm text-red-300">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

              {formError ? (
                <p className="font-praxis rounded-lg border border-red-400/40 bg-red-950/50 px-4 py-3 text-sm text-red-200">
                  {formError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="button-primary mt-2 w-full"
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="inline-block size-5 animate-spin rounded-full border-2 border-current border-r-transparent"
                      aria-hidden="true"
                    />
                    Cargando...
                  </>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </form>

            <p className={`mt-6 text-center ${bodyTextClass}`}>
              Acceso exclusivo para la comunidad UACH
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
