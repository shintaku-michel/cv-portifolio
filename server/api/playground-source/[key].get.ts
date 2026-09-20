import { createError, defineEventHandler, getRouterParam } from 'h3'
import { getHighlightedPlaygroundSource } from '../../utils/playground-highlight'

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  if (!key) {
    throw createError({ statusCode: 400, message: 'Parâmetro key é obrigatório' })
  }

  const html = await getHighlightedPlaygroundSource(key)
  if (!html) {
    throw createError({ statusCode: 404, message: 'Componente de playground não encontrado' })
  }

  return { html }
})
