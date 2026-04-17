import { useState } from 'react'

function fmt(secs) {
  if (!secs) return '0:00'
  return `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`
}
function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default function RecordingItem({ recording, index, onDelete, accentRgb, accentColor }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 2500)
      return
    }
    setDeleting(true)
    await onDelete(recording)
  }

  return (
    <div className="rounded-xl overflow-hidden transition-all"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>

      {/* Meta row */}
      <div className="flex items-center gap-2.5 px-3 pt-2.5 pb-1.5">
        {/* Index badge */}
        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: `rgba(${accentRgb},0.15)`, color: accentColor }}>
          {index + 1}
        </span>
        {/* Date */}
        <span className="flex-1 text-[11px] text-gray-500 leading-none">
          {fmtDate(recording.created_at)}
        </span>
        {/* Duration */}
        <span className="text-[11px] font-mono text-gray-600 leading-none">
          {fmt(recording.duration)}
        </span>
        {/* Delete */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          onBlur={() => setConfirming(false)}
          className="shrink-0 flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg transition-all duration-150"
          style={confirming
            ? { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }
            : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.07)' }}>
          {deleting ? '…' : confirming ? 'Confirm?' : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Audio player — full width */}
      <div className="px-3 pb-3">
        <audio src={recording.file_url} controls className="w-full h-8" />
      </div>
    </div>
  )
}
