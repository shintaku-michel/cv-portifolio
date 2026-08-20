import { describe, expect, it } from 'vitest'
import { extractReadableBlocks, renderMarkdown, splitSentences } from '../../app/utils/markdown'

describe('extractReadableBlocks', () => {
  it('extrai um item por parágrafo/título/lista, sem formatação', () => {
    const html = renderMarkdown('# Título\n\nPrimeiro parágrafo.\n\n- Item um\n- Item dois')
    expect(extractReadableBlocks(html)).toEqual(['Título', 'Primeiro parágrafo.', 'Item um', 'Item dois'])
  })

  it('ignora blocos vazios', () => {
    const html = renderMarkdown('Texto real.\n\n\n\nOutro texto.')
    expect(extractReadableBlocks(html)).toEqual(['Texto real.', 'Outro texto.'])
  })
})

describe('splitSentences', () => {
  it('separa frases por pontuação final', () => {
    expect(splitSentences('Frase um. Frase dois! Frase três?')).toEqual(['Frase um.', 'Frase dois!', 'Frase três?'])
  })

  it('devolve o texto inteiro quando não há pontuação final', () => {
    expect(splitSentences('Sem pontuação final')).toEqual(['Sem pontuação final'])
  })
})
