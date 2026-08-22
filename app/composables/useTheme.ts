export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'portfolio-cms:theme'

function applyTheme(value: Theme) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', value === 'dark')
}

// Estado compartilhado por toda a aplicação — qualquer componente que use
// este composable lê/escreve o mesmo tema (não é local a cada instância).
export function useTheme() {
  const theme = useState<Theme>('app-theme', () => 'light')

  function setTheme(value: Theme) {
    theme.value = value
    applyTheme(value)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(THEME_STORAGE_KEY, value)
    }
  }

  // Sincroniza o estado reativo com o que o script inline no <head> já
  // aplicou ao <html> antes da hidratação (evita flash de tema errado).
  function initTheme() {
    if (typeof window === 'undefined') return
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    theme.value = saved === 'dark' ? 'dark' : 'light'
    applyTheme(theme.value)
  }

  return { theme, setTheme, initTheme }
}
