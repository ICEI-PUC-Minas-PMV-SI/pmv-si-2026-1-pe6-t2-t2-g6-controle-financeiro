import { describe, it, expect } from 'vitest'
import { extractError } from '../../api/client'

describe('extractError', () => {
  it('retorna a mensagem do middleware do backend quando presente', () => {
    const err = { response: { data: { message: 'Categoria duplicada' } } }
    expect(extractError(err)).toBe('Categoria duplicada')
  })

  it('cai para data.title quando não há message (ValidationProblemDetails)', () => {
    const err = { response: { data: { title: 'Falha de validação' } } }
    expect(extractError(err)).toBe('Falha de validação')
  })

  it('usa err.message quando a resposta não tem corpo conhecido', () => {
    const err = { message: 'Network Error' }
    expect(extractError(err)).toBe('Network Error')
  })

  it('retorna texto padrão quando o erro é nulo', () => {
    expect(extractError(null)).toBe('Erro inesperado')
    expect(extractError(undefined)).toBe('Erro inesperado')
    expect(extractError({})).toBe('Erro inesperado')
  })

  it('prioriza message sobre title', () => {
    const err = {
      response: { data: { message: 'mensagem', title: 'titulo' } }
    }
    expect(extractError(err)).toBe('mensagem')
  })
})
