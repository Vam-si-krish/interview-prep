import { TOPICS } from '../../lib/questions'
import { supabase } from '../../lib/supabase'

const DIFFICULTY_COLOR = {
  easy: 'text-emerald-400',
  medium: 'text-amber-400',
  hard: 'text-red-400',
}

export default function Navbar({ activeTopic, onTopicChange, progress, userEmail }) {
  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 font-bold text-lg tracking-tight">DevPrep</span>
          <span className="text-gray-600 text-sm hidden sm:block">Interview Q&A</span>
        </div>

        <nav className="flex items-center gap-1">
          {TOPICS.map(topic => {
            const { answered, total } = progress[topic.id] || { answered: 0, total: 0 }
            const isActive = activeTopic === topic.id
            return (
              <button
                key={topic.id}
                onClick={() => onTopicChange(topic.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative group ${
                  isActive
                    ? 'bg-violet-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                {topic.label}
                {answered > 0 && (
                  <span className={`ml-1.5 text-xs ${isActive ? 'text-violet-200' : 'text-gray-500'}`}>
                    {answered}/{total}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex items-center gap-3">
          {userEmail && (
            <span className="text-gray-600 text-xs hidden md:block truncate max-w-[160px]" title={userEmail}>
              {userEmail}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-white text-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}
