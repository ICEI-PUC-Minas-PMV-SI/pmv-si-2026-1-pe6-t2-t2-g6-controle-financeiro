import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, getInitials, TransactionType } from '../utils/format'

describe('formatCurrency', () => {
  it('formata número como real brasileiro', () => {
    expect(formatCurrency(1234.5)).toMatch(/R\$\s?1\.234,50/)
  })

  it('retorna R$ 0,00 para null/undefined', () => {
    expect(formatCurrency(null)).toMatch(/R\$\s?0,00/)
    expect(formatCurrency(undefined)).toMatch(/R\$\s?0,00/)
  })

  it('formata zero', () => {
    expect(formatCurrency(0)).toMatch(/R\$\s?0,00/)
  })

  it('aceita string numérica', () => {
    expect(formatCurrency('100')).toMatch(/R\$\s?100,00/)
  })
})

describe('formatDate', () => {
  it('formata ISO string como pt-BR', () => {
    expect(formatDate('2026-11-28T12:00:00Z')).toBe('28/11/2026')
  })

  it('retorna string vazia para null', () => {
    expect(formatDate(null)).toBe('')
    expect(formatDate(undefined)).toBe('')
  })
})

describe('getInitials', () => {
  it('extrai primeira e última inicial', () => {
    expect(getInitials('Ana Luíza Ferreira')).toBe('AF')
  })

  it('retorna apenas a primeira letra para nome único', () => {
    expect(getInitials('Matheus')).toBe('M')
  })

  it('retorna ? para nome vazio', () => {
    expect(getInitials('')).toBe('?')
    expect(getInitials(null)).toBe('?')
  })
})

describe('TransactionType', () => {
  it('Income deve ser 1 (alinhado ao backend)', () => {
    expect(TransactionType.Income).toBe(1)
  })

  it('Expense deve ser 2 (alinhado ao backend)', () => {
    expect(TransactionType.Expense).toBe(2)
  })
})
