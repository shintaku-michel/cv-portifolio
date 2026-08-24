// Liga/desliga globalmente o efeito de revelação por mouse do RevealMask.
// Desativado por padrão — é um efeito decorativo opt-in, não deve reagir
// ao mouse sem o usuário ativar explicitamente pelo botão no menu.
export function useRevealMode() {
  const enabled = useState<boolean>('reveal-mode-enabled', () => false)

  function toggle() {
    enabled.value = !enabled.value
  }

  return { enabled, toggle }
}
