import { useEffect, useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'
import {
  listGoals,
  createGoal,
  depositGoal,
  deleteGoal
} from '../api/savingsGoals.js'
import { extractError } from '../api/client'
import { formatCurrency } from '../utils/format.js'

export default function Cofrinhos() {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [depositTarget, setDepositTarget] = useState(null)

  async function load() {
    try {
      setLoading(true)
      const data = await listGoals()
      setGoals(data)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Excluir este cofrinho?')) return
    try {
      await deleteGoal(id)
      setGoals((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      alert(extractError(err))
    }
  }

  const totalSaved = goals.reduce((acc, g) => acc + Number(g.currentAmount), 0)

  return (
    <div className="min-h-screen">
      <header className="px-10 py-6 flex items-center justify-between border-b border-border">
        <h1 className="text-[22px] font-bold text-ink">Cofrinhos</h1>
        <button onClick={() => setShowNewModal(true)} className="btn-dark px-4 py-2.5">
          <Plus size={16} />
          Novo cofrinho
        </button>
      </header>

      <div className="px-10 py-8 space-y-5 max-w-[1180px]">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
            {error}
          </div>
        )}

        {/* Resumo */}
        <div className="card bg-brand-900 text-white p-7">
          <p className="text-[11px] font-bold text-brand-500 tracking-widest">TOTAL GUARDADO</p>
          <p className="mt-3 text-[32px] font-bold">
            {formatCurrency(totalSaved)}{' '}
            <span className="text-sm font-medium text-muted">em {goals.length} metas</span>
          </p>
        </div>

        {loading && <p className="py-12 text-center text-muted text-sm">Carregando...</p>}

        {!loading && goals.length === 0 && (
          <div className="card p-12 text-center">
            <p className="text-muted text-sm">Você ainda não tem cofrinhos.</p>
            <button onClick={() => setShowNewModal(true)} className="btn-primary mt-4">
              Criar meu primeiro cofrinho
            </button>
          </div>
        )}

        {/* Grid 2x2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {goals.map((g) => (
            <div key={g.id} className="card p-7">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-ink">{g.name}</h3>
                  <p className="text-xs text-ink2 mt-1">
                    Criado em {new Date(g.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(g.id)}
                  className="text-muted hover:text-expense p-1.5 rounded-md hover:bg-red-50"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="text-[28px] font-bold text-ink">{formatCurrency(g.currentAmount)}</span>
                <span className="text-sm text-ink2">de {formatCurrency(g.targetAmount)}</span>
              </div>

              <div className="h-2 bg-surface2 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all"
                  style={{ width: `${Math.min(g.progressPercent, 100)}%` }}
                />
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs font-semibold text-income">
                  {Math.round(g.progressPercent)}% concluído
                </span>
                <span className="text-xs text-ink2">
                  Faltam {formatCurrency(Math.max(0, g.targetAmount - g.currentAmount))}
                </span>
              </div>

              <button
                onClick={() => setDepositTarget(g)}
                className="btn-primary w-full mt-5 py-2.5 text-sm"
              >
                + Adicionar valor
              </button>
            </div>
          ))}

          {/* Placeholder novo */}
          {goals.length > 0 && (
            <button
              onClick={() => setShowNewModal(true)}
              className="rounded-[20px] border-2 border-dashed border-border p-7 flex items-center justify-center text-brand-700 font-semibold hover:bg-brand-50 transition-colors min-h-[280px]"
            >
              + Criar novo cofrinho
            </button>
          )}
        </div>
      </div>

      {showNewModal && (
        <NewGoalModal
          onClose={() => setShowNewModal(false)}
          onCreated={async () => {
            setShowNewModal(false)
            await load()
          }}
        />
      )}

      {depositTarget && (
        <DepositModal
          goal={depositTarget}
          onClose={() => setDepositTarget(null)}
          onDone={async () => {
            setDepositTarget(null)
            await load()
          }}
        />
      )}
    </div>
  )
}

function NewGoalModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    const value = Number(target.toString().replace(',', '.'))
    if (isNaN(value) || value <= 0) {
      setErr('Informe um valor de meta válido.')
      return
    }
    try {
      setSubmitting(true)
      await createGoal({ name, targetAmount: value })
      onCreated()
    } catch (e) {
      setErr(extractError(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Novo cofrinho" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">Nome do cofrinho</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            placeholder="Ex: Viagem Europa"
            className="input"
          />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">Valor da meta</label>
          <div className="bg-bg border border-border rounded-[10px] px-4 py-3 flex items-center gap-2">
            <span className="text-base font-semibold text-muted">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              required
              placeholder="5000,00"
              className="flex-1 bg-transparent text-lg font-bold outline-none"
            />
          </div>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
            {err}
          </div>
        )}

        <div className="flex gap-3 pt-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
            {submitting ? 'Criando...' : 'Criar cofrinho'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function DepositModal({ goal, onClose, onDone }) {
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErr('')
    const value = Number(amount.toString().replace(',', '.'))
    if (isNaN(value) || value <= 0) {
      setErr('Informe um valor válido.')
      return
    }
    try {
      setSubmitting(true)
      await depositGoal(goal.id, value)
      onDone()
    } catch (e) {
      setErr(extractError(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title={`Aportar em "${goal.name}"`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-sm text-ink2">
          Atual: <strong className="text-ink">{formatCurrency(goal.currentAmount)}</strong> · Meta:{' '}
          <strong className="text-ink">{formatCurrency(goal.targetAmount)}</strong>
        </p>

        <div>
          <label className="block text-[13px] font-semibold text-ink mb-2">Valor a guardar</label>
          <div className="bg-bg border border-border rounded-[10px] px-4 py-3 flex items-center gap-2">
            <span className="text-base font-semibold text-muted">R$</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              placeholder="100,00"
              autoFocus
              className="flex-1 bg-transparent text-lg font-bold outline-none text-income"
            />
          </div>
        </div>

        {err && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
            {err}
          </div>
        )}

        <div className="flex gap-3 pt-3">
          <button type="button" onClick={onClose} className="btn-secondary flex-1 py-3">
            Cancelar
          </button>
          <button type="submit" disabled={submitting} className="btn-primary flex-1 py-3">
            {submitting ? 'Aportando...' : 'Confirmar aporte'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/55 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl w-full max-w-[480px] shadow-2xl">
        <div className="p-7 pb-5 flex items-start justify-between border-b border-surface2">
          <h3 className="text-xl font-bold text-ink">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-[10px] bg-bg hover:bg-surface2">
            <X size={18} />
          </button>
        </div>
        <div className="p-7">{children}</div>
      </div>
    </div>
  )
}
