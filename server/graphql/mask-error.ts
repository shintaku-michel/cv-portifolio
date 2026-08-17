import { createGraphQLError, maskError as defaultMaskError } from 'graphql-yoga'

type AppError = { statusCode: number, message?: string }

function toAppError(error: unknown): AppError | null {
  const candidate = (error as { originalError?: unknown })?.originalError ?? error
  if (
    candidate
    && typeof candidate === 'object'
    && 'statusCode' in candidate
    && typeof (candidate as { statusCode: unknown }).statusCode === 'number'
  ) {
    return candidate as AppError
  }
  return null
}

// O masking padrão do Yoga esconde a mensagem de QUALQUER erro que não seja
// um GraphQLError "puro" (segurança por padrão). Isso mascarava também os
// nossos erros esperados (401/403/404/409 do createError do H3, usados nos
// services/authorize.ts). Aqui só preservamos a mensagem original para
// erros de cliente (< 500); erros inesperados continuam mascarados.
export function maskError(error: unknown, message: string, isDev?: boolean) {
  const appError = toAppError(error)
  if (appError && appError.statusCode < 500) {
    return createGraphQLError(appError.message ?? message, {
      extensions: { code: appError.statusCode, http: { status: appError.statusCode } }
    })
  }
  return defaultMaskError(error, message, isDev)
}
