// Preferência do visitante de manter o menu lateral aberto. Fica em cookie
// (não em localStorage) para o SSR já renderizar a nav e o recuo do conteúdo
// no estado certo, sem a página "pular" após a hidratação. É só preferência
// de interface — não é dado sensível.
export function useNavPinned() {
  const cookie = useCookie<boolean>('nav-pinned', {
    default: () => false,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
  // Estado compartilhado entre a nav e o layout (recuo do <main>).
  const pinned = useState('nav-pinned', () => cookie.value === true)

  function togglePinned() {
    pinned.value = !pinned.value
    cookie.value = pinned.value
  }

  return { pinned, togglePinned }
}
