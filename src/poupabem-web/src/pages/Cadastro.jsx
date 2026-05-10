import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { extractError } from '../api/client'

export default function Cadastro() {
  const { register, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  function update(field) {
    return (e) => setForm((s) => ({ ...s, [field]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }
    if (form.password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.')
      return
    }
    if (!agreed) {
      setError('Você precisa aceitar os Termos de Uso.')
      return
    }

    try {
      await register(form)
      navigate('/dashboard')
    } catch (err) {
      setError(extractError(err))
    }
  }

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <div className="w-full max-w-[1312px] grid grid-cols-1 lg:grid-cols-[440px_1fr] gap-0 bg-white rounded-3xl overflow-hidden shadow-card">
        {/* Brand panel */}
        <div className="bg-brand-900 text-white p-10 flex flex-col">
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
            <h1 className="text-[36px] font-bold leading-tight">
              Comece a<br />
              <span className="text-brand-500">poupar hoje.</span>
            </h1>
            <p className="mt-3 text-brand-100/80 text-sm">
              Crie sua conta gratuita em 1 minuto.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-12">
          <form onSubmit={handleSubmit} className="max-w-[688px]">
            <h2 className="text-[32px] font-bold text-ink">Vamos começar</h2>
            <p className="mt-2 text-ink2 text-sm">Preencha os dados para criar sua conta.</p>

            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Nome</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={update('firstName')}
                  required
                  placeholder="Seu nome"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Sobrenome</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={update('lastName')}
                  required
                  placeholder="Seu sobrenome"
                  className="input"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[13px] font-semibold text-ink mb-2">E-mail</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                  placeholder="seu@email.com"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Senha</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={update('password')}
                  required
                  placeholder="••••••••"
                  className="input"
                />
                <p className="text-[11px] text-muted mt-1">Mínimo 8 caracteres</p>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-ink mb-2">Confirmar senha</label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  required
                  placeholder="••••••••"
                  className="input"
                />
              </div>
            </div>

            <label className="mt-5 flex items-center gap-2 cursor-pointer text-[13px] text-ink2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-4 h-4 rounded text-brand-700"
              />
              Concordo com os <span className="text-brand-700 font-semibold">Termos de Uso</span>.
            </label>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-[10px] px-4 py-3">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base mt-6">
              {loading ? 'Criando conta...' : 'Criar conta gratuita'}
            </button>

            <p className="text-center text-sm text-ink2 pt-4">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-brand-700 font-semibold hover:underline">
                Fazer login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
