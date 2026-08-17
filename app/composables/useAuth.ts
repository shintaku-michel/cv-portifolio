import type { SessionUser } from '#shared/types/auth'

function extractErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'data' in error) {
    const data = (error as { data?: { message?: string, statusMessage?: string } }).data
    if (data?.message) return data.message
    if (data?.statusMessage) return data.statusMessage
  }
  return fallback
}

export function useAuth() {
  const user = useState<SessionUser | null>('auth-user', () => null)
  const pending = useState('auth-pending', () => false)
  const error = useState<string | null>('auth-error', () => null)

  async function fetchUser() {
    // useRequestFetch (não $fetch global) repassa os cookies da requisição
    // original durante SSR — usado pelo middleware `admin` antes da página
    // renderizar.
    const requestFetch = useRequestFetch()
    const response = await requestFetch<{ user: SessionUser | null }>('/api/auth/me')
    user.value = response.user
  }

  async function login(email: string, password: string) {
    pending.value = true
    error.value = null
    try {
      const response = await $fetch<{ user: SessionUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      user.value = response.user
    } catch (err) {
      error.value = extractErrorMessage(err, 'Email ou senha inválidos.')
      throw new Error('login failed', { cause: err })
    } finally {
      pending.value = false
    }
  }

  async function register(name: string, email: string, password: string) {
    pending.value = true
    error.value = null
    try {
      const response = await $fetch<{ user: SessionUser }>('/api/auth/register', {
        method: 'POST',
        body: { name, email, password }
      })
      user.value = response.user
    } catch (err) {
      error.value = extractErrorMessage(err, 'Não foi possível concluir o cadastro.')
      throw new Error('register failed', { cause: err })
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, pending, error, fetchUser, login, register, logout }
}
