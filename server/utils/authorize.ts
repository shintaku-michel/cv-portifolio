import { createError } from 'h3'
import type { SessionUser } from '../services/auth.service'

export function assertAuthenticated(user: SessionUser | null): asserts user is SessionUser {
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Não autenticado' })
  }
}

export function assertAdmin(user: SessionUser | null): asserts user is SessionUser {
  assertAuthenticated(user)
  if (user.role !== 'ADMIN') {
    throw createError({ statusCode: 403, statusMessage: 'Acesso restrito a administradores' })
  }
}
