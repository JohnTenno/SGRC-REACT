import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FailAnimation } from '@/components/animations/FailAnimation'
import { SuccessAnimation } from '@/components/animations/SuccessAnimation'
import { LoginImageCarousel } from '@/components/auth/LoginImageCarousel'
import { saveAuthSession } from '@/lib/authSession'
import escudoUach from '@/assets/escudo-color.png'

/*simulacion de login exitoso (asi lo hago yo okey? no se como trabajas tu JAJA) t amo jonh*/

const labelClass =
  'font-alverata text-sm font-semibold uppercase tracking-[0.12em] text-white/95'

const subtitleClass = 'font-alverata text-base font-medium text-white/80'

const bodyTextClass = 'font-praxis text-sm text-white/70'

const MOCK_USERS_DB = {
  367651: {
    password: 'uach123',
    user: {
      id: 1,
      enrollment: '367651',
      name: 'Juan Pérez García',
      email: 'a367651@uach.mx',
      role: 'STUDENT',
      isTutor: false,
      facultyId: 1,
    },
  },
}

/* POST /api/v1/auth/login */
function buildLoginRequestBody(enrollment, password) {
  return {
    enrollment: enrollment.trim(),
    password,
  }
}

function simulateLogin(requestBody) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const record = MOCK_USERS_DB[requestBody.enrollment]

      if (!record || record.password !== requestBody.password) {
        reject({ status: 401, message: 'Matrícula o contraseña incorrectos.' })
        return
      }

      resolve({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-sgrc',
        user: record.user,
      })
    }, 900)
  })
}

async function login(requestBody) {
  if (import.meta.env.VITE_USE_MOCK_LOGIN !== 'false') {
    return simulateLogin(requestBody)
  }

  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  })

  const contentType = response.headers.get('content-type') ?? ''
  const data =
    contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    const message =
      data?.message ?? 'Matrícula o contraseña incorrectos.'
    throw { status: response.status, message }
  }

  return data
}

function validate({ enrollment, password }) {
  const errors = {}
  const trimmedEnrollment = enrollment.trim()

  if (!trimmedEnrollment) {
    errors.enrollment = 'La matrícula es obligatoria.'
  } else if (!/^\d{5,12}$/.test(trimmedEnrollment)) {
    errors.enrollment = 'Ingresa una matrícula válida (solo números).'
  }

  if (!password) {
    errors.password = 'La contraseña es obligatoria.'
  }

  return errors
}

export function LoginPage() {
  const navigate = useNavigate()
  const [enrollment, setEnrollment] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const errors = validate({ enrollment, password })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    setFailMessage(null)
    setIsSubmitting(true)

    const requestBody = buildLoginRequestBody(enrollment, password)

    try {
      const data = await login(requestBody)
      saveAuthSession({ token: data.token, user: data.user })
      setShowSuccess(true)
    } catch (error) {
      setFailMessage(
        error.status === 401
          ? error.message
          : 'No se pudo conectar con el servidor.',
      )
      if (error.status === 401) setPassword('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-uach-purple-950">
      {showSuccess ? (
        <SuccessAnimation
          title="¡Bienvenido!"
          message="Inicio de sesión exitoso"
          onComplete={() => navigate('/home', { replace: true })}
        />
      ) : null}

      {failMessage ? (
        <FailAnimation
          title="Error al iniciar sesión"
          message={failMessage}
          onClose={() => setFailMessage(null)}
        />
      ) : null}

      <main className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        {/* Carrusel — solo escritorio (mitad izquierda) */}
        <LoginImageCarousel className="hidden shrink-0 lg:block lg:min-h-screen lg:w-1/2" />

        {/* Formulario — mitad derecha */}
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

          <form
            className="flex flex-col gap-6"
            onSubmit={handleSubmit}
            noValidate
          >
              {/* Campo matrícula */}
              <div className="flex flex-col gap-2">
                <label htmlFor="enrollment" className={labelClass}>
                  Matrícula institucional
                </label>
                <input
                  id="enrollment"
                  name="enrollment"
                  type="text"
                  inputMode="numeric"
                  autoComplete="username"
                  placeholder="Número de matrícula"
                  value={enrollment}
                  onChange={(e) => {
                    setEnrollment(e.target.value)
                    setFieldErrors((prev) => ({
                      ...prev,
                      enrollment: undefined,
                    }))
                  }}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.enrollment)}
                  aria-describedby={
                    fieldErrors.enrollment ? 'enrollment-error' : undefined
                  }
                  className="input-field"
                />
                {fieldErrors.enrollment ? (
                  <p id="enrollment-error" className="font-praxis text-sm text-red-200">
                    {fieldErrors.enrollment}
                  </p>
                ) : null}
              </div>

              {/* Campo contraseña */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className={labelClass}>
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Contraseña de acceso"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }))
                  }}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(fieldErrors.password)}
                  aria-describedby={
                    fieldErrors.password ? 'password-error' : undefined
                  }
                  className="input-field"
                />
                {fieldErrors.password ? (
                  <p id="password-error" className="font-praxis text-sm text-red-200">
                    {fieldErrors.password}
                  </p>
                ) : null}
              </div>

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

          <p className={`mt-6 text-center text-uach-gold-400/80 ${bodyTextClass}`}>
            Demo: matrícula <span className="font-mono">367651</span> · contraseña{' '}
            <span className="font-mono">uach123</span>
          </p>

          <p className={`mt-3 text-center ${bodyTextClass}`}>
            Acceso exclusivo para la comunidad UACH
          </p>
        </div>
        </section>
      </main>
    </div>
  )
}
