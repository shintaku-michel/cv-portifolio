// Proteção de navegação apenas (seção 20 do CLAUDE.md): a autorização de
// verdade acontece no servidor (assertAdmin nos resolvers GraphQL). Este
// middleware só evita a navegação/flash de UI para quem não é ADMIN.
export default defineNuxtRouteMiddleware(async () => {
  const { user, fetchUser } = useAuth()

  if (!user.value) {
    await fetchUser()
  }

  if (!user.value || user.value.role !== 'ADMIN') {
    return navigateTo('/login')
  }
})
