import { useEffect, useState, useMemo } from 'react'
import { tokenize } from '../lib/tokenize'
import { getWordStates } from '../lib/words'
import WordCount from './WordCount'

const CHUNK_SIZE = 10000 // characters per page

export default function Reader({ text, onBack, onWordTap, sessionMarks, onSessionMark, knownCountRefresh }) {
  const [wordStates, setWordStates] = useState({})
  const [loadingStates, setLoadingStates] = useState(true)
  const [page, setPage] = useState(0)
  const [selectionStart, setSelectionStart] = useState(null) // { index: number, word: string }

  // Split text into pages by character count, breaking at paragraph boundaries
  const pages = useMemo(() => {
    const result = []
    let start = 0
    while (start < text.length) {
      let end = start + CHUNK_SIZE
      if (end >= text.length) {
        result.push(text.slice(start))
        break
      }
      // Find a paragraph break near the chunk boundary
      const nextPara = text.indexOf('\n\n', end - 500)
      if (nextPara !== -1 && nextPara < end + 500) {
        end = nextPara + 2
      } else {
        // Fall back to sentence boundary
        const nextSentence = text.indexOf('. ', end - 200)
        if (nextSentence !== -1 && nextSentence < end + 200) {
          end = nextSentence + 2
        }
      }
      result.push(text.slice(start, end))
      start = end
    }
    return result
  }, [text])

  const tokens = useMemo(() => tokenize(pages[page] || ''), [pages, page])

  useEffect(() => {
    getWordStates()
      .then(states => { setWordStates(states); setLoadingStates(false) })
      .catch(err => { console.error('Failed to load word states:', err); setLoadingStates(false) })
  }, [])

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  const refreshWordState = (word, state) => {
    setWordStates(prev => ({ ...prev, [word.toLowerCase()]: state }))
    if (onSessionMark) onSessionMark()
  }

  const getWordClass = (word, index) => {
    const state = wordStates[word.toLowerCase()]
    let baseClass = 'cursor-pointer rounded px-0.5 transition-colors py-1'
    
    // Selection highlighting - only highlight the start word when in selection mode
    if (selectionStart && index === selectionStart.index) {
      baseClass += ' bg-blue-200' // Start word gets blue highlight
    } else {
      // Normal word state colors
      if (state === 'learning') {
        baseClass += ' bg-yellow-200 hover:bg-yellow-300'
      } else if (state === 'known') {
        baseClass += ' hover:bg-stone-100'
      } else {
        baseClass += ' hover:bg-stone-100'
      }
    }
    
    return baseClass
  }

  const handleWordClick = (token, index) => {
    // Only handle word tokens
    if (token.type !== 'word') return

    if (!selectionStart) {
      // First tap: start selection
      setSelectionStart({ index, word: token.value })
    } else if (selectionStart.index === index) {
      // Second tap on same word: treat as single word selection
      onWordTap(token.value, refreshWordState, wordStates[token.value.toLowerCase()])
      setSelectionStart(null)
    } else {
      // Second tap on different word: create phrase
      const startIdx = Math.min(selectionStart.index, index)
      const endIdx = Math.max(selectionStart.index, index)
      
      // Build phrase by joining all tokens from start to end
      const phraseTokens = tokens.slice(startIdx, endIdx + 1)
      const phrase = phraseTokens.map(t => t.value).join('')
      
      // Call onWordTap with the phrase (TranslationPopup will handle it)
      onWordTap(phrase, refreshWordState, null) // null state since phrases don't have states
      setSelectionStart(null)
    }
  }

  const handleBackdropClick = () => {
    setSelectionStart(null)
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="sticky top-0 bg-amber-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-stone-500 text-sm font-medium py-2 pr-4">← Back</button>
        <div className="flex items-center gap-3">
          <WordCount refreshTrigger={knownCountRefresh} />
          {pages.length > 1 && (
            <span className="text-xs text-stone-400">
              {page + 1}/{pages.length}
            </span>
          )}
          {sessionMarks > 0 && !loadingStates && (
            <span className="text-xs text-stone-400">{sessionMarks} marked</span>
          )}
        </div>
      </div>

      {/* Text */}
      <div className="px-4 py-6 max-w-2xl mx-auto" onClick={handleBackdropClick}>
        <p className="text-stone-800 text-xl leading-relaxed font-serif whitespace-pre-line">
          {tokens.map((token, i) => {
            if (token.type === 'space') return token.value
            if (token.type === 'punct') return <span key={i} className="text-stone-600">{token.value}</span>
            return (
              <span
                key={i}
                className={getWordClass(token.value, i)}
                onClick={(e) => {
                  e.stopPropagation() // Prevent backdrop click
                  handleWordClick(token, i)
                }}
              >
                {token.value}
              </span>
            )
          })}
        </p>
      </div>

      {/* Pagination */}
      {pages.length > 1 && (
        <div className="sticky bottom-0 bg-amber-50 border-t border-stone-200 px-4 py-3 flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={page === 0}
            className="px-4 py-2 rounded-lg bg-white border border-stone-200 text-stone-600 text-sm font-medium disabled:opacity-30 active:bg-stone-50"
          >
            ← Prev
          </button>
          <span className="text-stone-400 text-sm">Page {page + 1} of {pages.length}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page === pages.length - 1}
            className="px-4 py-2 rounded-lg bg-stone-800 text-amber-50 text-sm font-medium disabled:opacity-30 active:bg-stone-900"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
