import type { RouterConfig } from '@nuxt/schema'

// Scroll suave até a seção (id na URL) ao navegar pela barra de ícones —
// tanto entre âncoras da mesma página quanto vindo de outra rota.
export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (!to.hash) return { top: 0 }

    return new Promise((resolve) => {
      setTimeout(() => {
        const el = document.querySelector(to.hash)
        resolve(el ? { el: to.hash, top: 0, behavior: 'smooth' } : { top: 0 })
      }, 150)
    })
  }
}
