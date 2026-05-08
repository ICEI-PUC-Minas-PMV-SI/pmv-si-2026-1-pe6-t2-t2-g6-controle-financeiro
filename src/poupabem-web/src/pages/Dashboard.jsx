import { useEffect, useState } from 'react'
import { Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, ComposedChart } from 'recharts'
import { useAuth } from '../contexts/AuthContext.jsx'
import { listTransactions } from '../api/transactions.js'
import { listGoals } from '../api/savingsGoals.js'
import { listCategories } from '../api/categories.js'
import { getSummary } from '../api/reports.js'
import { formatCurrency, formatDate, TransactionType } from '../utils/format.js'

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0 })
  const [transactions, setTransactions] = useState([])
  const [goals, setGoals] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [summaryData, txData, goalsData, catsData] = await Promise.all([
          getSummary(),
          listTransactions(),
          listGoals(),
          listCategories()
        ])
        setSummary(summaryData)
        setTransactions(txData)
        setGoals(goalsData)
        setCategories(catsData)
      } catch (err) {
        setError('Não foi possível carregar os dados. Verifique se o backend está rodando.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))
  const recentTx = [...transactions]
    .sort((a, b) => new Date(b.ocurredAt) - new Date(a.ocurredAt))
    .slice(0, 5)

  // Simple monthly evolution from transactions
  const monthlyData = buildMonthlyEvolution(transactions)

  const firstName = user?.fullName?.split(' ')[0] || 'usuário'

  return (
    <div className="min-h-screen">
      <header className="px-10 py-6 flex items-center justify-between border-b border-border">
        <div>
          <h1 className="text-[22px] font-bold text-ink">Olá, {firstName}</h1>
        </div>
        <Link to="/transacoes" className="btn-dark px-4 py-2.5">
          <Plus size={16} />
          Nova
        </Link>
      </header>

      <div className="px-10 py-8 space-y-6 max-w-[1180px]">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
            {error}
          </div>
        )}

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="card bg-brand-900 text-white p-7">
            <p className="text-[11px] font-bold text-brand-500 tracking-widest">SALDO ATUAL</p>
            <p className="mt-3 text-[32px] font-bold">{formatCurrency(summary.balance)}</p>
            <p className="mt-2 text-xs text-muted">Período total</p>
          </div>

          <div className="card p-7">
            <p className="text-[11px] font-bold text-muted tracking-widest">RECEITAS</p>
            <p className="mt-3 text-[28px] font-bold text-income">
              {formatCurrency(summary.totalIncome)}
            </p>
            <p className="mt-2 text-xs text-ink2">
              {transactions.filter((t) => t.transactionType === TransactionType.Income).length} entradas
            </p>
          </div>

          <div className="card p-7">
            <p className="text-[11px] font-bold text-muted tracking-widest">DESPESAS</p>
            <p className="mt-3 text-[28px] font-bold text-expense">
              {formatCurrency(summary.totalExpense)}
            </p>
            <p className="mt-2 text-xs text-ink2">
              {transactions.filter((t) => t.transactionType === TransactionType.Expense).length} saídas
            </p>
          </div>
        </div>

        {/* Chart + Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          <div className="card p-7">
            <h2 className="text-lg font-bold text-ink">Evolução do saldo</h2>
            <p className="text-xs text-ink2 mt-1">Últimos 6 meses</p>
            <div className="mt-6 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={monthlyData} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                  <defs>
                    <linearGradient id="balanceArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#F5F5F0" vertical={false} />
                  <XAxis dataKey="month" stroke="#A8A29E" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#A8A29E" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1C1917', border: 'none', borderRadius: 8, color: '#fff' }}
                    formatter={(v) => formatCurrency(v)}
                  />
                  <Area type="monotone" dataKey="balance" fill="url(#balanceArea)" stroke="none" />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#fff', stroke: '#10B981', strokeWidth: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-7">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink">Cofrinhos</h2>
              <Link to="/cofrinhos" className="text-[13px] font-semibold text-brand-700 hover:underline">
                Ver todos →
              </Link>
            </div>
            <div className="mt-6 space-y-6">
              {goals.length === 0 && (
                <p className="text-sm text-muted">Você ainda não tem cofrinhos.</p>
              )}
              {goals.slice(0, 3).map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-semibold text-ink">{g.name}</p>
                    <span className="text-[13px] font-bold text-ink">
                      {Math.round(g.progressPercent)}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface2 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${Math.min(g.progressPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-muted mt-1.5">
                    {formatCurrency(g.currentAmount)} de {formatCurrency(g.targetAmount)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent transactions */}
        <div className="card p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Últimas transações</h2>
            <Link to="/transacoes" className="text-[13px] font-semibold text-brand-700 hover:underline">
              Ver todas →
            </Link>
          </div>

          <div className="mt-5">
            <div className="grid grid-cols-[1fr_180px_120px_140px] text-[11px] font-bold text-muted tracking-wider px-2 pb-3 border-b border-surface2">
              <span>DESCRIÇÃO</span>
              <span>CATEGORIA</span>
              <span>DATA</span>
              <span className="text-right">VALOR</span>
            </div>

            {loading && <p className="py-8 text-center text-muted text-sm">Carregando...</p>}

            {!loading && recentTx.length === 0 && (
              <p className="py-8 text-center text-muted text-sm">
                Nenhuma transação. <Link to="/transacoes" className="text-brand-700 font-semibold">Criar primeira</Link>
              </p>
            )}

            {recentTx.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[1fr_180px_120px_140px] items-center px-2 py-3 border-b border-surface2 last:border-b-0"
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Build last 6 months running balance from transaction list
function buildMonthlyEvolution(transactions) {
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      month: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
      income: 0,
      expense: 0
    })
  }

  for (const t of transactions) {
    const d = new Date(t.ocurredAt)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const m = months.find((x) => x.key === key)
    if (m) {
      if (t.transactionType === TransactionType.Income) m.income += Number(t.amount)
      else m.expense += Number(t.amount)
    }
  }

  let running = 0
  return months.map((m) => {
    running += m.income - m.expense
    return { month: m.month, balance: running }
  })
}
