import { useState } from 'react'
import RecordingControls from '../Recording/RecordingControls'
import RecordingItem from '../Recording/RecordingItem'
import { useRecordings } from '../../hooks/useRecordings'

const DIFFICULTY_BADGE = {
  easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  hard: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function QuestionDetail({ question, userId, onAnswered }) {
  const { recordings, loading, upload, remove } = useRecordings(question?.id, userId)
  const [uploading, setUploading] = useState(false)

  if (!question) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="text-4xl mb-3">👈</div>
          <p className="text-sm">Select a question from the sidebar</p>
        </div>
      </div>
    )
  }

  async function handleNewRecording(result) {
    setUploading(true)
    const saved = await upload(result)
    setUploading(false)
    if (saved) onAnswered(question.id)
  }

  return (
    <main className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Question */}
        <div className="mb-8">
          <span className={`inline-block text-xs px-2.5 py-1 rounded-full border font-medium mb-3 ${DIFFICULTY_BADGE[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <h2 className="text-xl lg:text-2xl font-semibold text-white leading-snug">
            {question.text}
          </h2>
        </div>

        {/* Recording controls */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Your recordings
              {recordings.length > 0 && (
                <span className="ml-2 text-violet-400 normal-case tracking-normal">({recordings.length})</span>
              )}
            </h3>
            <RecordingControls onNewRecording={handleNewRecording} uploading={uploading} />
          </div>

          {/* Recordings list */}
          {loading ? (
            <div className="space-y-2">
              {[0, 1].map(i => (
                <div key={i} className="h-14 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : recordings.length === 0 ? (
            <div className="text-center py-10 text-gray-600 border border-dashed border-gray-800 rounded-xl">
              <div className="text-3xl mb-2">🎙️</div>
              <p className="text-sm">No recordings yet — hit record to start</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recordings.map((rec, i) => (
                <RecordingItem
                  key={rec.id}
                  recording={rec}
                  index={i}
                  onDelete={remove}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
