import { useEffect, useState } from 'react'
import { translate } from '../lib/deepl'
import { setWordState } from '../lib/words'

export default function TranslationPopup({ word, currentState, onStateChange, onDismiss, onKnownWord }) {
  const [translation, setTranslation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    translate(word)
      .then(t => { setTranslation(t); setLoading(false) })
      .catch(() => { setError('Translation failed'); setLoading(false) })
  }, [word])

  const handleMark = async (state) => {
    setSaving(true)
    // Optimistic update first
    onStateChange(word, state)
    if (state === 'known' && onKnownWord) onKnownWord()
    onDismiss()
    // Then persist (fire and forget — if it fails, the state will be wrong next session but UI is fine now)
    setWordState(word, state).catch(e => console.error('Failed to save word state:', e))
  }

  return (
    <>
      {/* Backdrop — tap outside to dismiss */}
      <div
        className="fixed inset-0 z-40"
        onClick={onDismiss}
      />

      {/* Popup — fixed to bottom of screen on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-stone-100 p-6 pb-8">
        {/* Word */}
        <div className="mb-1">
          <span className="text-2xl font-serif text-stone-800">{word}</span>
          {currentState && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              currentState === 'learning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
            }`}>
              {currentState}
            </span>
          )}
        </div>

        {/* Translation */}
        <div className="mb-5 min-h-[1.5rem]">
          {loading && <p className="text-stone-400 text-sm">Translating...</p>}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {translation && <p className="text-stone-600 text-base">{translation}</p>}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => handleMark('learning')}
            disabled={saving}
            className="flex-1 py-4 rounded-xl bg-yellow-100 text-yellow-800 font-medium text-base active:bg-yellow-200 disabled:opacity-50"
          >
            Learning
          </button>
          <button
            onClick={() => handleMark('known')}
            disabled={saving}
            className="flex-1 py-4 rounded-xl bg-stone-800 text-amber-50 font-medium text-base active:bg-stone-900 disabled:opacity-50"
          >
            Known ✓
          </button>
        </div>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          className="mt-3 w-full py-3 text-stone-400 text-sm active:text-stone-600"
        >
          Dismiss
        </button>
      </div>
    </>
  )
}
