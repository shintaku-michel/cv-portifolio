type GraphQLResponse<T> = {
  data: T | null
  errors?: { message: string }[]
}

export async function useGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  // useRequestFetch (não $fetch global) repassa os cookies da requisição
  // original durante SSR — sem isso, queries autenticadas (ex: listagem
  // admin) perdem a sessão no primeiro render.
  const requestFetch = useRequestFetch()
  const response = await requestFetch<GraphQLResponse<T>>('/api/graphql', {
    method: 'POST',
    body: { query, variables }
  })

  if (response.errors?.length) {
    throw new Error(response.errors[0]?.message ?? 'Erro ao consultar a API')
  }

  return response.data as T
}
