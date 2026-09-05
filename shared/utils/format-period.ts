function toMonthYear(value: string) {
  const [year, month] = value.split('-')
  return `${month}/${year}`
}

export function formatPeriod(start: string | null, end: string | null) {
  if (!start) return null
  const startLabel = toMonthYear(start)
  const endLabel = end ? toMonthYear(end) : 'Ativo'
  return `${startLabel} a ${endLabel}`
}
