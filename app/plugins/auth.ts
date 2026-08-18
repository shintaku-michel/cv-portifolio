// Garante que o estado de sessão (useAuth().user) é carregado uma única
// vez por app, incluindo no SSR — sem isso, páginas que nunca chamam
// fetchUser() explicitamente (ex: /posts/[slug]) sempre acham que o
// visitante está deslogado no primeiro carregamento/refresh, mesmo com
// sessão válida, já que useState começa como null.
export default defineNuxtPlugin(async () => {
  const { fetchUser } = useAuth()
  await callOnce('auth-user', fetchUser)
})
