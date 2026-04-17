import { useRecorder } from '../../hooks/useRecorder'

function MicIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 10v2a7 7 0 01-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" strokeLinecap="round" />
      <line x1="8" y1="23" x2="16" y2="23" strokeLinecap="round" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <rect x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  )
}

export default function RecordingControls({ onNewRecording, uploading, accentRgb, accentGradient, accentColor }) {
  const { isRecording, formattedTime, start, stop } = useRecorder()

  async function handleStop() {
    const result = await stop()
    if (result) onNewRecording(result)
  }

  if (uploading) return (
    <button disabled
      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-semibold text-gray-500 transition-all"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="spinner" style={{ width: 16, height: 16 }} />
      Saving recording…
    </button>
  )

  if (isRecording) return (
    <div className="w-full rounded-xl overflow-hidden"
      style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.25)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Live timer */}
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 shrink-0 record-pulse-ring" />
          <span className="text-red-400 font-mono text-xl font-bold tabular-nums tracking-wider">
            {formattedTime}
          </span>
          <span className="text-[10px] text-red-500/60 font-medium uppercase tracking-widest">Recording…</span>
        </div>
        {/* Stop button */}
        <button onClick={handleStop}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white transition-all hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 16px rgba(239,68,68,0.35)' }}>
          <StopIcon />
          Stop
        </button>
      </div>
    </div>
  )

  return (
    <button onClick={start}
      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-85 active:scale-[0.98]"
      style={{
        background: accentGradient,
        boxShadow: `0 4px 20px rgba(${accentRgb},0.35)`,
      }}>
      <MicIcon />
      Record your answer
    </button>
  )
}
