// Limiter simples em memória (sem Redis — volume de um portfólio
// pessoal não justifica infra extra). Não sobrevive a restart/deploy
// multi-instância, o que é aceitável neste porte de projeto.
const buckets = new Map<string, { count: number, resetAt: number }>()

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000

setInterval(() => {
  const now = Date.now()
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) {
      buckets.delete(key)
    }
  }
}, CLEANUP_INTERVAL_MS).unref()

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= limit) {
    return false
  }

  bucket.count += 1
  return true
}
