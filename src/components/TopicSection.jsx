import { useState, useRef, useEffect } from 'react'
import QuestionRow from './QuestionRow'
import { useQuestions } from '../hooks/useQuestions'

export default function TopicSection({ topic, userId, isOpen, onToggle }) {
  const [activeQuestionId, setActiveQuestionId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [newText, setNewText] = useState('')
  const [saving, setSaving] = useState(false)
  const [answeredIds, setAnsweredIds] = useState(new Set())
  const inputRef = useRef(null)

  const { questions, loading, addQuestion, deleteQuestion } = useQuestions(topic.id, userId)

  useEffect(() => {
    if (!isOpen) {
      setActiveQuestionId(null)
      setAdding(false)
      setNewText('')
    }
  }, [isOpen])

  const answered = questions.filter(q => answeredIds.has(q.id)).length
  const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0

  function handleAnswered(id) {
    setAnsweredIds(prev => new Set([...prev, id]))
  }

  function handleQuestionToggle(id) {
    setActiveQuestionId(prev => prev === id ? null : id)
  }

  async function handleAddQuestion(e) {
    e.preventDefault()
    if (!newText.trim()) return
    setSaving(true)
    await addQuestion(newText)
    setNewText('')
    setSaving(false)
    setAdding(false)
  }

  function openAdding() {
    setAdding(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  return (
    <div style={{
      borderRadius: '18px',
      overflow: 'hidden',
      border: `1px solid ${isOpen ? `rgba(${topic.rgb},0.35)` : 'rgba(255,255,255,0.09)'}`,
      boxShadow: isOpen
        ? `0 0 40px rgba(${topic.rgb},0.12), 0 8px 32px rgba(0,0,0,0.45)`
        : '0 2px 12px rgba(0,0,0,0.28)',
      transition: 'border-color 0.3s, box-shadow 0.3s',
      /* Left color accent bar */
      borderLeft: `3px solid ${isOpen ? topic.color : 'transparent'}`,
    }}>

      {/* ── Topic header button ── */}
      <button
        onClick={onToggle}
        style={{
          width: '100%', textAlign: 'left',
          position: 'relative', overflow: 'hidden',
          padding: '20px 22px',
          background: isOpen
            ? `linear-gradient(135deg, rgba(${topic.rgb},0.2) 0%, rgba(${topic.rgb},0.07) 55%, rgba(6,6,15,0.9) 100%)`
            : `linear-gradient(135deg, rgba(${topic.rgb},0.07) 0%, rgba(${topic.rgb},0.02) 55%, rgba(6,6,15,0.97) 100%)`,
          transition: 'background 0.3s ease',
          cursor: 'pointer',
          border: 'none',
          display: 'block',
        }}
      >
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '-24px', right: '-24px',
          width: '130px', height: '130px', borderRadius: '50%',
          background: `radial-gradient(circle, ${topic.glow} 0%, transparent 70%)`,
          opacity: isOpen ? 0.9 : 0.22,
          transition: 'opacity 0.35s',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Emoji badge */}
          <div style={{
            width: '56px', height: '56px',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px',
            flexShrink: 0,
            background: `linear-gradient(135deg, rgba(${topic.rgb},0.28), rgba(${topic.rgb},0.08))`,
            border: `1px solid rgba(${topic.rgb},0.3)`,
            boxShadow: isOpen ? `0 0 22px rgba(${topic.rgb},0.32)` : 'none',
            transition: 'box-shadow 0.3s',
          }}>
            {topic.emoji}
          </div>

          {/* Label + meta */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <h3 style={{
                fontSize: '15px', fontWeight: 800,
                color: isOpen ? topic.color : '#e2e8f0',
                margin: 0, letterSpacing: '-0.2px',
                transition: 'color 0.2s',
              }}>
                {topic.label}
              </h3>
              {!loading && (
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '100px',
                  background: `rgba(${topic.rgb},0.12)`,
                  color: topic.color,
                  border: `1px solid rgba(${topic.rgb},0.22)`,
                }}>
                  {questions.length === 0 ? 'No questions' : `${questions.length} Q`}
                </span>
              )}
              {answered > 0 && (
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  padding: '3px 10px', borderRadius: '100px',
                  background: 'rgba(52,211,153,0.1)', color: '#34d399',
                  border: '1px solid rgba(52,211,153,0.22)',
                }}>
                  ✓ {answered}/{questions.length}
                </span>
              )}
            </div>
            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>
              {topic.description}
            </p>

            {/* Progress bar */}
            {questions.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                <div style={{
                  flex: 1, height: '5px',
                  borderRadius: '100px', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.07)',
                }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: pct === 100 ? '#34d399' : topic.gradient,
                    borderRadius: '100px',
                    transition: 'width 0.8s ease',
                  }} />
                </div>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: pct === 100 ? '#34d399' : `rgba(${topic.rgb},0.8)`,
                  minWidth: '28px', textAlign: 'right',
                }}>
                  {pct}%
                </span>
              </div>
            )}
          </div>

          {/* Chevron */}
          <div style={{
            flexShrink: 0,
            width: '34px', height: '34px',
            borderRadius: '10px',
            background: isOpen ? `rgba(${topic.rgb},0.14)` : 'rgba(255,255,255,0.06)',
            border: `1px solid ${isOpen ? `rgba(${topic.rgb},0.25)` : 'rgba(255,255,255,0.1)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease, background 0.2s, border-color 0.2s',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke={isOpen ? topic.color : 'rgba(255,255,255,0.45)'} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>

      {/* ── Expanded content ── */}
      {isOpen && (
        <div className="animate-fadeIn" style={{
          borderTop: `1px solid rgba(${topic.rgb},0.14)`,
          background: 'rgba(3,3,11,0.8)',
        }}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loading ? (
              <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
                <div className="spinner" />
              </div>
            ) : questions.length === 0 && !adding ? (
              <div style={{
                padding: '40px 20px', textAlign: 'center', borderRadius: '16px',
                border: `1px dashed rgba(${topic.rgb},0.22)`,
                background: `rgba(${topic.rgb},0.03)`,
              }}>
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{topic.emoji}</div>
                <p style={{ color: '#d1d5db', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>No questions yet</p>
                <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '20px' }}>
                  Add your first {topic.label} question to get started
                </p>
                <button
                  onClick={openAdding}
                  style={{
                    background: topic.gradient,
                    boxShadow: `0 4px 18px rgba(${topic.rgb},0.35)`,
                    color: '#fff', fontSize: '13px', fontWeight: 700,
                    padding: '10px 22px', borderRadius: '12px',
                    border: 'none', cursor: 'pointer',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
                >
                  + Add question
                </button>
              </div>
            ) : (
              questions.map(q => (
                <QuestionRow
                  key={q.id} question={q} userId={userId}
                  accentColor={topic.color} accentRgb={topic.rgb} accentGradient={topic.gradient}
                  isOpen={activeQuestionId === q.id}
                  onToggle={() => handleQuestionToggle(q.id)}
                  onDelete={deleteQuestion}
                  onAnswered={handleAnswered}
                />
              ))
            )}

            {/* Add question form */}
            {adding ? (
              <form onSubmit={handleAddQuestion} className="animate-fadeIn" style={{
                borderRadius: '14px', padding: '16px',
                background: `rgba(${topic.rgb},0.06)`,
                border: `1px solid rgba(${topic.rgb},0.22)`,
              }}>
                <textarea
                  ref={inputRef} value={newText}
                  onChange={e => setNewText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddQuestion(e) }
                    if (e.key === 'Escape') { setAdding(false); setNewText('') }
                  }}
                  placeholder={`Your ${topic.label} question… (Enter to save, Esc to cancel)`}
                  rows={2}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    fontSize: '14px',
                    color: '#fff',
                    resize: 'none',
                    outline: 'none',
                    marginBottom: '12px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => { setAdding(false); setNewText('') }}
                    style={{
                      padding: '8px 16px', borderRadius: '8px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#9ca3af', fontSize: '13px', cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || !newText.trim()}
                    style={{
                      padding: '8px 20px', borderRadius: '8px',
                      background: topic.gradient,
                      border: 'none',
                      color: '#fff', fontSize: '13px', fontWeight: 700,
                      cursor: 'pointer',
                      opacity: saving || !newText.trim() ? 0.45 : 1,
                    }}
                  >
                    {saving ? 'Saving…' : 'Add'}
                  </button>
                </div>
              </form>
            ) : questions.length > 0 && (
              <button
                onClick={openAdding}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '12px',
                  border: `1px dashed rgba(${topic.rgb},0.25)`,
                  background: `rgba(${topic.rgb},0.04)`,
                  color: `rgba(${topic.rgb},0.75)`,
                  fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add question
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
