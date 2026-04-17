import { useState } from 'react'
import { supabase } from '../../lib/supabase'

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
}
const inputFocusStyle = {
  borderColor: 'rgba(124,58,237,0.5)',
  boxShadow: '0 0 0 3px rgba(124,58,237,0.15)',
}

function AuthInput({ type, value, onChange, placeholder, label }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium tracking-wide">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, ...(focused ? inputFocusStyle : {}) }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600"
      />
    </div>
  )
}

export default function LoginPage({ onSwitchToSignup }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#06060f' }}>

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute" style={{
          top: '-10%', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '400px',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)',
        }} />
        <div className="absolute" style={{
          bottom: '10%', right: '15%',
          width: '300px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 70%)',
        }} />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-base font-black"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                boxShadow: '0 0 24px rgba(124,58,237,0.5)',
              }}>
              D
            </div>
            <span className="text-white font-bold text-xl tracking-tight">DevPrep</span>
          </div>
          <p className="text-gray-500 text-sm">Your personal interview preparation vault</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-7"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
          }}>
          <h2 className="text-white font-bold text-lg mb-6">Welcome back</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <AuthInput
              type="email" label="Email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <AuthInput
              type="password" label="Password"
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            {error && (
              <div className="rounded-xl px-4 py-2.5 text-red-400 text-sm animate-fadeIn"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full rounded-xl py-2.5 text-white text-sm font-bold mt-2 hover:opacity-90 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(124,58,237,0.4)',
              }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-5">
            No account?{' '}
            <button onClick={onSwitchToSignup}
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Create one
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
