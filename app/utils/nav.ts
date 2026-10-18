/** Remove a barra final (exceto da raiz) para `/perfil/` e `/perfil` serem a mesma rota. */
function normalizePath(path: string): string {
  return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/**
 * Regra única de item ativo do menu: a rota atual pertence ao item quando é
 * igual a um dos prefixos em `matches` ou é subrota dele (`/projetos/slug`).
 * A raiz `/` só casa exatamente — senão todo caminho a ativaria.
 */
export function isNavItemActive(path: string, matches: readonly string[]): boolean {
  const current = normalizePath(path)
  return matches.some((prefix) => {
    if (prefix === '/') return current === '/'
    return current === prefix || current.startsWith(`${prefix}/`)
  })
}
