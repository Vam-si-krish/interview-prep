const DIFFICULTY_DOT = {
  easy: 'bg-emerald-500',
  medium: 'bg-amber-500',
  hard: 'bg-red-500',
}

export default function QuestionList({ questions, selectedId, answeredIds, onSelect }) {
  return (
    <aside className="w-72 shrink-0 border-r border-gray-800 bg-gray-900 overflow-y-auto">
      <div className="p-4 border-b border-gray-800">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
          {answeredIds.size} / {questions.length} answered
        </p>
        <div className="mt-2 h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${questions.length ? (answeredIds.size / questions.length) * 100 : 0}%` }}
          />
        </div>
      </div>

      <ul className="py-2">
        {questions.map((q, i) => {
          const isAnswered = answeredIds.has(q.id)
          const isSelected = selectedId === q.id
          return (
            <li key={q.id}>
              <button
                onClick={() => onSelect(q)}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                  isSelected
                    ? 'bg-violet-950 border-r-2 border-violet-500'
                    : 'hover:bg-gray-800'
                }`}
              >
                <span className="shrink-0 w-5 h-5 mt-0.5 flex items-center justify-center">
                  {isAnswered ? (
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-600 mt-1" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-snug line-clamp-2 ${isSelected ? 'text-white' : isAnswered ? 'text-gray-300' : 'text-gray-400'}`}>
                    <span className="text-gray-600 mr-1">{i + 1}.</span>
                    {q.text}
                  </p>
                  <span className={`inline-block mt-1 text-xs ${
                    q.difficulty === 'easy' ? 'text-emerald-500' :
                    q.difficulty === 'medium' ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {q.difficulty}
                  </span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
