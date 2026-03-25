import { useEffect, useState } from 'react'
import { tokenize } from '../lib/tokenize'
import { getWordStates } from '../lib/words'

export default function Reader({ text, onBack, onWordTap, sessionMarks, onSessionMark }) {
  const [tokens] = useState(() => tokenize(text))
  const [wordStates, setWordStates] = useState({})
  const [loadingStates, setLoadingStates] = useState(true)

  useEffect(() => {
    getWordStates()
      .then(states => { setWordStates(states); setLoadingStates(false) })
      .catch(err => { console.error('Failed to load word states:', err); setLoadingStates(false) })
  }, [])

  // Called by parent when a word state changes
  const refreshWordState = (word, state) => {
    setWordStates(prev => ({ ...prev, [word.toLowerCase()]: state }))
    if (onSessionMark) onSessionMark()
  }

  const getWordClass = (word) => {
    const state = wordStates[word.toLowerCase()]
    if (state === 'learning') return 'bg-yellow-200 rounded px-0.5 cursor-pointer hover:bg-yellow-300'
    if (state === 'known') return 'cursor-pointer hover:bg-stone-100 rounded px-0.5'
    // unknown — no highlight but still tappable
    return 'cursor-pointer hover:bg-stone-100 rounded px-0.5'
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="sticky top-0 bg-amber-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-stone-500 text-sm font-medium py-2 pr-4">← Back</button>
        <div className="flex items-center gap-2">
          {loadingStates && <span className="text-xs text-stone-400">Loading...</span>}
          {sessionMarks > 0 && !loadingStates && <span className="text-xs text-stone-400">{sessionMarks} marked this session</span>}
        </div>
      </div>

      {/* Text */}
      <div className="px-4 py-6 max-w-2xl mx-auto">
        <p className="text-stone-800 text-lg leading-relaxed font-serif">
          {tokens.map((token, i) => {
            if (token.type === 'space') return token.value
            if (token.type === 'punct') return <span key={i} className="text-stone-600">{token.value}</span>
            return (
              <span
                key={i}
                className={`transition-colors ${getWordClass(token.value)}`}
                onClick={() => onWordTap(token.value, refreshWordState, wordStates[token.value.toLowerCase()])}
              >
                {token.value}
              </span>
            )
          })}
        </p>
      </div>
    </div>
  )
}
