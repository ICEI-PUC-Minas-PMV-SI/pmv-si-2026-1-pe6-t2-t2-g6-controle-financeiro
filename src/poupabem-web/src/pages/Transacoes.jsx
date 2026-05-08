import { useEffect, useState } from 'react'
import { Plus, Download, X, Trash2 } from 'lucide-react'
import {
  listTransactions,
  createTransaction,
  deleteTransaction
} from '../api/transactions.js'
import { listCategories, createCategory } from '../api/categories.js'
import { exportTransactionsCsv } from '../api/reports.js'
import { extractError } from '../api/client'
import { formatCurrency, formatDate, TransactionType } from '../utils/format.js'

export default function Transacoes() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterType, setFilterType] = useState(null) // null | 1 | 2
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [showModal, setShowModal] = useState(false)

  async function loadData() {
    try {
      setLoading(true)
      const [txs, cats] = await Promise.all([
        listTransactions({
          transactionType: filterType || undefined,
          categoryId: filterCategoryId || undefined
        }),
        listCategories()
      ])
      setTransactions(txs)
      setCategories(cats)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [filterType, filterCategoryId])

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))

  async function handleDelete(id) {
    if (!confirm('Excluir esta transação?')) return
    try {
      await deleteTransaction(id)
      setTransactions((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      alert(extractError(err))
    }
  }

  async function handleExport() {
    try {
      await exportTransactionsCsv({
        transactionType: filterType || undefined,
        categoryId: filterCategoryId || undefined
      })
    } catch (err) {
      alert(extractError(err))
    }
  }

  const sorted = [...transactions].sort((a, b) => new Date(b.ocurredAt) - new Date(a.ocurredAt))

  return (
    <div className="min-h-screen">
      <header className="px-10 py-6 flex items-center justify-between border-b border-border">
        <h1 className="text-[22px] font-bold text-ink">Transações</h1>
        <button onClick={() => setShowModal(true)} className="btn-dark px-4 py-2.5">
          <Plus size={16} />
          Nova
        </button>
      </header>

      <div className="px-10 py-8 space-y-5 max-w-[1180px]">
        {/* Filtros */}
        <div className="card p-4 flex items-center gap-3 flex-wrap">
          {/* Tipo segmented */}
          <div className="bg-surface2 rounded-[10px] p-1 flex">
            <SegmentBtn active={filterType === null} onClick={() => setFilterType(null)}>
              Todas
            </SegmentBtn>
            <SegmentBtn
              active={filterType === TransactionType.Income}
              onClick={() => setFilterType(TransactionType.Income)}
            >
              Receitas
            </SegmentBtn>
            <SegmentBtn
              active={filterType === TransactionType.Expense}
              onClick={() => setFilterType(TransactionType.Expense)}
            >
              Despesas
            </SegmentBtn>
          </div>

          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="bg-bg border border-border rounded-[10px] px-4 py-2 text-sm font-medium text-ink"
          >
            <option value="">Todas categorias</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type === 1 ? 'Receita' : 'Despesa'})
              </option>
            ))}
          </select>

          <button onClick={handleExport} className="btn-secondary ml-auto px-4 py-2 text-sm">
            <Download size={14} />
            Exportar CSV
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
            {error}
          </div>
        )}

        {/* Tabela */}
        <div className="card p-7">
          <div className="grid grid-cols-[1fr_200px_140px_160px_60px] text-[11px] font-bold text-muted tracking-wider pb-3 border-b border-surface2">
            <span>DESCRIÇÃO</span>
            <span>CATEGORIA</span>
            <span>DATA</span>
            <span className="text-right">VALOR</span>
            <span></span>
          </div>

          {loading && <p className="py-12 text-center text-muted text-sm">Carregando...</p>}

          {!loading && sorted.length === 0 && (
            <p className="py-12 text-center text-muted text-sm">
              Nenhuma transação encontrada nesse filtro.
            </p>
          )}

          {sorted.map((t) => (
            <div
              key={t.id}
              className="grid grid-cols-[1fr_200px_140px_160px_60px] items-center py-3 border-b border-surface2 last:border-b-0"
            >
              <span className="text-sm font-medium text-ink">{t.title}</span>
              <span className="text-[13px] text-ink2">
                {categoryById[t.categoryId]?.name || '—'}
              </span>
              <span className="text-[13px] text-ink2">{formatDate(t.ocurredAt)}</span>
              <span
                className={`text-sm font-bold text-right ${
                  t.transactionType === TransactionType.Income ? 'text-income' : 'text-expense'
                }`}
              >
                {t.transactionType === TransactionType.Income ? '+ ' : '- '}
                {formatCurrency(t.amount)}
              </span>
              <button
                onClick={() => handleDelete(t.id)}
                className="text-muted hover:text-expense p-1.5 rounded-md hover:bg-red-50 justify-self-end"
                title="Excluir"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <NewTransactionModal
          categories={categories}
          onClose={() => setShowModal(false)}
          onCreated={async () => {
            setShowModal(false)
            await loadData()
          }}
          onCategoriesChanged={loadData}
        />
      )}
    </div>
  )
}

function SegmentBtn({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
        active ? 'bg-white text-ink shadow-card' : 'text-muted hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function NewTransactionModal({ categories, onClose, onCreated, onCategoriesChanged }) {
  const [type, setType] = useState(TransactionType.Expense)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [ocurredAt, setOcurredAt] = useState(new Date().toISOString().slice(0, 16))
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')
  const [showNewCat, setShowNewCat] = useState(false)
  const [newCatName, setNewCatName] = useState('')

  const filteredCats = categories.filter((c) => c.type === type)

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')

    if (!categoryId) {
      setErr('Selecione uma categoria.')
      return
    }
    const value = Number(amount.toString().replace(',', '.'))
    if (isNaN(value) || value <= 0) {
      setErr('Informe um valor válido.')
      return
    }

    try {
      setSubmitting(true)
      await createTransaction({
        title,
        description: description || null,
        amount: value,
        transactionType: type,
        categoryId,
        ocurredAt: new Date(ocurredAt).toISOString()
      })
      onCreated()
    } catch (e) {
      setErr(extractError(e))
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCreateCategory() {
    if (!newCatName.trim()) return
    try {
      const created = await createCategory({ name: newCatName.trim(), type })
      setNewCatName('')
      setShowNewCat(false)
      setCategoryId(created.id)
      onCategoriesChanged()
    } catch (e) {
      setErr(extractError(e))
    }
  }

  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl w-full max-w-[600px] shadow-2xl">
        <div className="p-10 pb-6 flex items-start justify-between border-b border-surface2">
          <div>
            <p className="text-[11px] font-bold text-muted tracking-widest">REGISTRAR</p>
            <h3 className="text-[26px] font-bold text-ink mt-1">Nova transação</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-[10px] bg-bg hover:bg-surface2">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-5">
          {/* Tipo */}
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-3">Tipo</label>
            <div className="grid grid-cols-2 gap-3">
              <TypeButton
                active={type === TransactionType.Expense}
                color="expense"
                label="Despesa"
                hint="Saída de dinheiro"
                onClick={() => {
                  setType(TransactionType.Expense)
                  setCategoryId('')
                }}
              />
              <TypeButton
                active={type === TransactionType.Income}
                color="income"
                label="Receita"
                hint="Entrada de dinheiro"
                onClick={() => {
                  setType(TransactionType.Income)
                  setCategoryId('')
                }}
              />
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-2">Valor</label>
            <div className="bg-bg border border-border rounded-[14px] px-4 py-4 flex items-center gap-3">
              <span className="text-xl font-semibold text-muted">R$</span>
              <input
                type="text"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
                className={`flex-1 bg-transparent text-3xl font-bold outline-none ${
                  type === TransactionType.Income ? 'text-income' : 'text-expense'
                }`}
              />
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-2">Descrição</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              placeholder="Ex: Mercado Extra"
              className="input"
            />
          </div>

          {/* Categoria + Data */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-ink mb-2">Categoria</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  if (e.target.value === '__new__') {
                    setShowNewCat(true)
                  } else {
                    setCategoryId(e.target.value)
                  }
                }}
                required
                className="input"
              >
                <option value="">Selecione...</option>
                {filteredCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                <option value="__new__">+ Nova categoria</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-ink mb-2">Data</label>
              <input
                type="datetime-local"
                value={ocurredAt}
                onChange={(e) => setOcurredAt(e.target.value)}
                required
                className="input"
              />
            </div>
          </div>

          {showNewCat && (
            <div className="bg-bg border border-border rounded-[10px] p-4 flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nome da nova categoria"
                className="flex-1 bg-transparent outline-none text-sm"
              />
              <button type="button" onClick={handleCreateCategory} className="btn-primary px-4 py-1.5 text-xs">
                Criar
              </button>
              <button
                type="button"
                onClick={() => setShowNewCat(false)}
                className="text-muted hover:text-ink text-xs px-2"
              >
                Cancelar
              </button>
            </div>
          )}

          {/* Observações */}
          <div>
            <label className="block text-[13px] font-semibold text-ink mb-2">
              Observações <span className="text-muted font-medium">(opcional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input resize-none"
            />
          </div>

          {err && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
              {err}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-3 border-t border-surface2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">
              Cancelar
            </button>
            <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
              {submitting ? 'Salvando...' : 'Salvar transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TypeButton({ active, color, label, hint, onClick }) {
  const isExpense = color === 'expense'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all ${
        active
          ? isExpense
            ? 'bg-red-50 border-expense'
            : 'bg-emerald-50 border-income'
          : 'border-border bg-white hover:bg-bg'
      }`}
    >
      <p className={`text-[15px] font-bold ${active ? (isExpense ? 'text-expense' : 'text-income') : 'text-ink'}`}>
        {label}
      </p>
      <p className={`text-[11px] mt-1 ${active ? (isExpense ? 'text-expense/80' : 'text-income/80') : 'text-muted'}`}>
        {hint}
      </p>
    </button>
  )
}
