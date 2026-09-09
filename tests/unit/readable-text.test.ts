import { describe, expect, it } from 'vitest'
import { extractReadableBlocks, splitSentences } from '../../app/utils/readable-text'

describe('extractReadableBlocks', () => {
  it('extrai um item por parágrafo/título/lista, sem formatação', () => {
    const html = '<h1>Título</h1><p>Primeiro parágrafo.</p><ul><li>Item um</li><li>Item dois</li></ul>'
    expect(extractReadableBlocks(html)).toEqual(['Título', 'Primeiro parágrafo.', 'Item um', 'Item dois'])
  })

  it('ignora blocos vazios', () => {
    const html = '<p>Texto real.</p><p></p><p>Outro texto.</p>'
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
