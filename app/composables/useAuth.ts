import type { SessionUser } from '../../shared/types/auth'

export function useAuth() {
  const user = useState<SessionUser | null>('auth-user', () => null)
  const pending = useState('auth-pending', () => false)
  const error = useState<string | null>('auth-error', () => null)

  async function fetchUser() {
    const response = await $fetch<{ user: SessionUser | null }>('/api/auth/me')
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
    } catch {
      error.value = 'Email ou senha inválidos.'
      throw new Error('login failed')
    } finally {
      pending.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, pending, error, fetchUser, login, logout }
}
