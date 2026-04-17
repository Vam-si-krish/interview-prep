import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { TOPICS } from './lib/topics'
import LoginPage from './components/Auth/LoginPage'
import SignupPage from './components/Auth/SignupPage'
import Header from './components/Header'
import TopicSection from './components/TopicSection'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [authView, setAuthView] = useState('login')
  const [activeTopicId, setActiveTopicId] = useState(null)

  function handleTopicToggle(id) {
    setActiveTopicId(prev => prev === id ? null : id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  if (!session) return authView === 'login'
    ? <LoginPage onSwitchToSignup={() => setAuthView('signup')} />
    : <SignupPage onSwitchToLogin={() => setAuthView('login')} />

  // Extract a readable display name from email
  const emailUser = session.user.email?.split('@')[0] ?? 'there'
  const displayName = emailUser.charAt(0).toUpperCase() + emailUser.slice(1)

  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Header userEmail={session.user.email} />

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px 60px' }}>

        {/* ── Hero ── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <span style={{ fontSize: '28px', lineHeight: 1 }}>👋</span>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 900, letterSpacing: '-0.5px', lineHeight: 1.1, margin: 0 }}>
                <span style={{ color: '#fff' }}>Hey, </span>
                <span className="shimmer-text">{displayName}!</span>
              </h1>
              <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>
                Record your answers · Build confidence · Land the job
              </p>
            </div>
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {[
              { emoji: '📚', label: `${TOPICS.length} Topics`, bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.22)', color: '#a78bfa' },
              { emoji: '🎯', label: 'Your questions', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.2)', color: '#22d3ee' },
              { emoji: '🎙️', label: 'Voice recordings', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', color: '#fb923c' },
            ].map(s => (
              <div key={s.label} style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: '100px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
              }}>
                <span style={{ fontSize: '14px' }}>{s.emoji}</span>
                <span style={{ color: s.color, fontSize: '12px', fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
          <span style={{ color: '#374151', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Topics</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
        </div>

        {/* ── Topic accordions ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {TOPICS.map(topic => (
            <TopicSection
              key={topic.id}
              topic={topic}
              userId={session.user.id}
              isOpen={activeTopicId === topic.id}
              onToggle={() => handleTopicToggle(topic.id)}
            />
          ))}
        </div>

        {/* ── Footer nudge ── */}
        <p style={{ textAlign: 'center', color: '#374151', fontSize: '12px', marginTop: '52px' }}>
          Every recording is a step closer to your dream job 💪
        </p>
      </main>
    </div>
  )
}
