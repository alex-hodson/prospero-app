import { useEffect, useState } from 'react'
import { tokenize } from '../lib/tokenize'
import { getWordStates } from '../lib/words'

export default function Reader({ text, onBack, onWordTap }) {
  const [tokens] = useState(() => tokenize(text))
  const [wordStates, setWordStates] = useState({})

  useEffect(() => {
    // Load word states from Supabase
    getWordStates().then(setWordStates).catch(console.error)
  }, [])

  // Called by parent when a word state changes
  const refreshWordState = (word, state) => {
    setWordStates(prev => ({ ...prev, [word.toLowerCase()]: state }))
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
        <span className="text-stone-400 text-xs">Tap a word to translate</span>
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
