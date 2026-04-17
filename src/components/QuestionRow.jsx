import { useState, useRef } from 'react'
import RecordingControls from './Recording/RecordingControls'
import RecordingItem from './Recording/RecordingItem'
import NotesEditor from './NotesEditor'
import { useRecordings } from '../hooks/useRecordings'
import { supabase } from '../lib/supabase'

export default function QuestionRow({
  question, userId,
  accentColor, accentRgb, accentGradient,
  isOpen, onToggle, onDelete, onAnswered,
}) {
  const [confirmDel, setConfirmDel] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { recordings, loading, uploadError, upload, remove } = useRecordings(question.id, userId)

  const [notes, setNotes] = useState(question.notes || '')
  const [notesSaved, setNotesSaved] = useState(false)
  const saveTimer = useRef(null)

  const hasRec = recordings.length > 0
  const hasNotes = notes && notes.replace(/<[^>]*>/g, '').trim().length > 0

  async function handleNewRecording(result) {
    setUploading(true)
    const saved = await upload(result)
    setUploading(false)
    if (saved) onAnswered(question.id)
  }

  function handleNotesChange(html) {
    setNotes(html)
    setNotesSaved(false)
    clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await supabase.from('questions').update({ notes: html }).eq('id', question.id)
      setNotesSaved(true)
      setTimeout(() => setNotesSaved(false), 2000)
    }, 600)
  }

  const rowBg = isOpen
    ? `rgba(${accentRgb},0.07)`
    : 'rgba(255,255,255,0.04)'
  const rowBorder = isOpen
    ? `rgba(${accentRgb},0.3)`
    : 'rgba(255,255,255,0.1)'

  return (
    <div style={{
      borderRadius: '14px',
      overflow: 'hidden',
      border: `1px solid ${rowBorder}`,
      background: rowBg,
      transition: 'border-color 0.2s, background 0.2s',
    }}>

      {/* ── Question header ── */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          padding: '16px 18px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {/* Status dot */}
        <div style={{
          flexShrink: 0,
          width: '24px', height: '24px',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: hasRec ? `rgba(${accentRgb},0.18)` : 'rgba(255,255,255,0.06)',
          border: hasRec ? `2px solid rgba(${accentRgb},0.45)` : '2px solid rgba(255,255,255,0.14)',
          transition: 'all 0.2s',
        }}>
          {hasRec
            ? <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={accentColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            : <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'block' }} />
          }
        </div>

        {/* Question text */}
        <p style={{
          flex: 1,
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: 1.5,
          color: isOpen ? '#fff' : 'rgba(255,255,255,0.78)',
          margin: 0,
          transition: 'color 0.15s',
        }}>
          {question.question_text}
        </p>

        {/* Right side: badges + delete + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {hasRec && (
            <span style={{
              fontSize: '11px', fontWeight: 700,
              padding: '4px 10px',
              borderRadius: '100px',
              background: `rgba(${accentRgb},0.12)`,
              color: accentColor,
              border: `1px solid rgba(${accentRgb},0.25)`,
              display: 'flex', alignItems: 'center', gap: '5px',
            }}>
              🎙 {recordings.length}
            </span>
          )}
          {hasNotes && !isOpen && (
            <span style={{
              fontSize: '11px', padding: '4px 10px', borderRadius: '100px',
              background: 'rgba(250,204,21,0.1)', color: '#fbbf24',
              border: '1px solid rgba(250,204,21,0.22)',
            }}>
              📝
            </span>
          )}

          {/* Delete button */}
          <button
            onClick={e => {
              e.stopPropagation()
              if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 2500); return }
              onDelete(question.id)
            }}
            style={{
              width: '32px', height: '32px',
              borderRadius: '8px',
              border: confirmDel ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
              background: confirmDel ? 'rgba(239,68,68,0.12)' : 'transparent',
              color: confirmDel ? '#f87171' : 'rgba(255,255,255,0.28)',
              fontSize: confirmDel ? '10px' : '14px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s',
              padding: 0,
              flexShrink: 0,
            }}
            onMouseEnter={e => { if (!confirmDel) e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
            onMouseLeave={e => { if (!confirmDel) e.currentTarget.style.color = 'rgba(255,255,255,0.28)' }}
          >
            {confirmDel ? 'Del?' : '×'}
          </button>

          {/* Chevron */}
          <div style={{
            width: '32px', height: '32px',
            borderRadius: '8px',
            background: isOpen ? `rgba(${accentRgb},0.14)` : 'rgba(255,255,255,0.06)',
            border: isOpen ? `1px solid rgba(${accentRgb},0.22)` : '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease, background 0.2s, border-color 0.2s',
            flexShrink: 0,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={isOpen ? accentColor : 'rgba(255,255,255,0.45)'} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Expanded panel — two-column layout ── */}
      {isOpen && (
        <div className="animate-fadeIn" style={{ borderTop: `1px solid rgba(${accentRgb},0.12)` }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>

            {/* ── LEFT: Recordings ── */}
            <div style={{
              flex: '1 1 300px',
              padding: '20px',
              borderRight: '1px solid rgba(255,255,255,0.06)',
            }}>
              {/* Section label */}
              <div style={{
                fontSize: '10px', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: `rgba(${accentRgb},0.5)`,
                marginBottom: '14px',
              }}>
                {loading ? '…' : `${recordings.length} Recording${recordings.length !== 1 ? 's' : ''}`}
              </div>

              <RecordingControls
                onNewRecording={handleNewRecording}
                uploading={uploading}
                accentRgb={accentRgb}
                accentGradient={accentGradient}
                accentColor={accentColor}
              />

              {uploadError && (
                <div style={{
                  marginTop: '10px', padding: '10px 14px',
                  borderRadius: '10px', fontSize: '12px', color: '#f87171',
                  background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)',
                }}>
                  ⚠️ {uploadError}
                </div>
              )}

              {!loading && recordings.length === 0 ? (
                <div style={{
                  marginTop: '14px', padding: '20px',
                  borderRadius: '12px', textAlign: 'center',
                  border: `1px dashed rgba(${accentRgb},0.18)`,
                  background: `rgba(${accentRgb},0.02)`,
                }}>
                  <p style={{ color: '#6b7280', fontSize: '12px' }}>Hit record to capture your answer</p>
                </div>
              ) : (
                <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {recordings.map((rec, i) => (
                    <RecordingItem key={rec.id} recording={rec} index={i} onDelete={remove}
                      accentRgb={accentRgb} accentColor={accentColor} />
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Notes ── */}
            <div style={{ flex: '1 1 300px', padding: '20px' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                marginBottom: '14px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(250,204,21,0.55)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6b7280' }}>
                  Notes
                </span>
                {notesSaved && (
                  <span className="animate-fadeIn" style={{ fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                    ✓ Saved
                  </span>
                )}
              </div>
              <NotesEditor initialContent={notes} onChange={handleNotesChange} />
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
