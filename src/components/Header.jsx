import { supabase } from '../lib/supabase'

export default function Header({ userEmail }) {
  return (
    <header style={{
      background: 'rgba(6,6,15,0.85)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      width: '100%',
    }}>
      {/* Animated rainbow border at top */}
      <div className="gradient-border-anim" style={{ height: '2px', width: '100%' }} />

      {/* Inner centered row */}
      <div style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c3aed, #6366f1)',
            boxShadow: '0 0 18px rgba(124,58,237,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', fontWeight: 900, color: '#fff', flexShrink: 0,
          }}>
            D
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.3px', lineHeight: 1 }}>
              DevPrep
            </div>
            <div style={{ color: '#4b5563', fontSize: '9px', marginTop: '2px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Interview Prep Vault
            </div>
          </div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userEmail && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '6px 14px',
              borderRadius: '100px',
              background: 'rgba(52,211,153,0.07)',
              border: '1px solid rgba(52,211,153,0.18)',
            }}>
              <div style={{
                width: '7px', height: '7px', borderRadius: '50%',
                background: '#34d399',
                boxShadow: '0 0 6px rgba(52,211,153,0.7)',
                flexShrink: 0,
              }} />
              <span style={{ color: '#9ca3af', fontSize: '12px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userEmail}
              </span>
            </div>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            style={{
              background: 'rgba(255,255,255,0.06)',
              color: '#94a3b8',
              border: '1px solid rgba(255,255,255,0.1)',
              padding: '7px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)'
              e.currentTarget.style.color = '#f87171'
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
              e.currentTarget.style.color = '#94a3b8'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
