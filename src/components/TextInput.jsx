import { useState } from 'react'
import WordCount from './WordCount'
import { sampleTexts } from '../lib/sampleTexts'

export default function TextInput({ onRead, onShowWords, onShowLibrary, knownCountRefresh = 0 }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(null) // index of loading book

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) onRead(text.trim())
  }

  const handleBookTap = async (item, index) => {
    setLoading(index)
    try {
      const res = await fetch(item.file)
      if (!res.ok) throw new Error('Failed to load')
      const bookText = await res.text()
      onRead(bookText)
    } catch (err) {
      console.error('Failed to load book:', err)
      setLoading(null)
    }
  }

  const levelColor = (level) => {
    if (level === 'Principiante') return 'bg-green-100 text-green-700'
    if (level === 'Intermedio') return 'bg-yellow-100 text-yellow-700'
    return 'bg-red-100 text-red-700'
  }

  return (
    <div className="min-h-screen bg-amber-50 p-4 pb-12">
      <div className="w-full max-w-2xl mx-auto pt-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif text-stone-800 mb-2">Prospero</h1>
          <p className="text-stone-500 text-sm">Paste Spanish text or pick a book below</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <WordCount refreshTrigger={knownCountRefresh} />
            {onShowWords && (
              <button
                onClick={onShowWords}
                className="text-sm text-amber-700 underline underline-offset-2"
              >
                My Words
              </button>
            )}
            {onShowLibrary && (
              <button
                onClick={onShowLibrary}
                className="text-sm text-amber-700 underline underline-offset-2"
              >
                Library
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Pega aquí texto en español..."
            className="w-full min-h-[10rem] p-4 rounded-xl border border-stone-200 bg-white text-stone-800 text-base resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif leading-relaxed shadow-sm"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="mt-3 w-full py-4 rounded-xl bg-stone-800 text-amber-50 font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed active:bg-stone-900 transition-colors"
          >
            Read →
          </button>
        </form>

        {/* Library */}
        <div className="mt-10">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-4">Library</h2>
          <div className="space-y-3">
            {sampleTexts.map((item, i) => (
              <button
                key={i}
                onClick={() => handleBookTap(item, i)}
                disabled={loading !== null}
                className="w-full text-left p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 active:bg-stone-50 transition-colors shadow-sm disabled:opacity-60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-stone-800 font-serif font-medium">
                      {item.title}
                      {loading === i && <span className="ml-2 text-stone-400 text-sm">Loading...</span>}
                    </p>
                    <p className="text-stone-400 text-sm mt-0.5">{item.author}</p>
                    <p className="text-stone-300 text-xs mt-1">{item.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${levelColor(item.level)}`}>
                    {item.level}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
