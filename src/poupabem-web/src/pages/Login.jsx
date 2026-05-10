import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { extractError } from '../api/client'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(extractError(err))
    }
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-[1312px] grid grid-cols-1 lg:grid-cols-[640px_1fr] gap-0 bg-white rounded-3xl overflow-hidden shadow-card">
        {/* Brand panel */}
        <div className="bg-brand-900 text-white p-12 flex flex-col">
          <div className="flex items-center gap-3 mb-auto">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none">
              <ellipse cx="20" cy="22" rx="18" ry="14" fill="#FAFAF7" />
              <circle cx="25" cy="18" r="2" fill="#064E3B" />
              <rect x="9" y="34" width="4" height="7" rx="1.5" fill="#FAFAF7" />
              <rect x="26" y="34" width="4" height="7" rx="1.5" fill="#FAFAF7" />
              <path d="M3 20 Q0 16 4 14 L8 18 Z" fill="#FAFAF7" />
              <rect x="14" y="9" width="8" height="2" rx="1" fill="#FAFAF7" />
              <circle cx="38" cy="9" r="4" fill="#F59E0B" />
            </svg>
            <span className="text-xl font-bold">PoupaBem</span>
          </div>

          <div className="my-auto">
            <h1 className="text-[44px] font-bold leading-tight">
              Suas finanças<br />
              <span className="text-brand-500">no lugar certo.</span>
            </h1>
            <p className="mt-4 text-brand-100/80 text-base">
              Registre receitas, organize despesas e poupe<br />
              para o que importa.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-16 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-[488px]">
            <h2 className="text-[36px] font-bold text-ink">Entrar na sua conta</h2>
            <p className="mt-2 text-ink2 text-[15px]">Acesse seu painel financeiro</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="input"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[13px] font-semibold text-ink">Senha</label>
                  <button type="button" className="text-[13px] font-semibold text-brand-700 hover:underline">
                    Esqueci a senha
                  </button>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base">
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="text-center text-sm text-ink2 pt-4">
                Ainda não tem conta?{' '}
                <Link to="/cadastro" className="text-brand-700 font-semibold hover:underline">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
