import { useState } from 'react'
import { LIBRARY } from '../lib/library'

const LEVEL_COLORS = {
  A1: 'bg-green-100 text-green-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-purple-100 text-purple-700',
}

export default function Library({ onSelect, onBack }) {
  const [filter, setFilter] = useState('All')

  const levels = ['All', 'A1', 'A2', 'B1']
  const filtered = filter === 'All' ? LIBRARY : LIBRARY.filter(t => t.level === filter)

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="sticky top-0 bg-amber-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-stone-500 text-sm font-medium py-2 pr-4">← Back</button>
        <span className="text-stone-700 font-medium text-sm">Library</span>
        <div className="w-16" />
      </div>

      {/* Level filter */}
      <div className="px-4 pt-4 pb-2 flex gap-2">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setFilter(level)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === level
                ? 'bg-stone-800 text-amber-50'
                : 'bg-white border border-stone-200 text-stone-500'
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* Text list */}
      <div className="px-4 py-2 max-w-2xl mx-auto space-y-3">
        {filtered.map(text => (
          <button
            key={text.id}
            onClick={() => onSelect(text)}
            className="w-full text-left bg-white rounded-xl border border-stone-100 p-4 active:bg-stone-50 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-serif text-stone-800 text-lg leading-tight">{text.title}</h3>
                <p className="text-stone-500 text-sm mt-1">{text.description}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${LEVEL_COLORS[text.level] || 'bg-stone-100 text-stone-500'}`}>
                {text.level}
              </span>
            </div>
          </button>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-8">No texts at this level yet.</p>
        )}
      </div>

      <p className="text-center text-stone-300 text-xs pb-6 pt-2">
        {LIBRARY.length} texts • More coming soon
      </p>
    </div>
  )
}
