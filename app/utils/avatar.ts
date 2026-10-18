/**
 * Fotos de perfil do Google vêm com o tamanho no fim da URL (`...=s96-c`,
 * 96px). Troca pelo tamanho pedido para não exibir a foto esticada e borrada.
 * URLs fora desse formato voltam como estão.
 */
export function googleAvatarAtSize(url: string, px: number): string {
  if (!url.includes('googleusercontent.com')) return url
  return /=s\d+(-c)?$/.test(url) ? url.replace(/=s\d+(-c)?$/, `=s${px}-c`) : url
}
