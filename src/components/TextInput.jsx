import { useState } from 'react'
import WordCount from './WordCount'

export default function TextInput({ onRead, knownCountRefresh = 0 }) {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) onRead(text.trim())
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-serif text-stone-800 mb-2">Prospero</h1>
          <p className="text-stone-500 text-sm">Paste Spanish text to start reading</p>
        </div>
        <form onSubmit={handleSubmit}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Pega aquí texto en español..."
            className="w-full min-h-[12rem] p-4 rounded-xl border border-stone-200 bg-white text-stone-800 text-base resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 font-serif leading-relaxed shadow-sm"
            autoFocus
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="mt-3 w-full py-4 rounded-xl bg-stone-800 text-amber-50 font-medium text-base disabled:opacity-40 disabled:cursor-not-allowed active:bg-stone-900 transition-colors"
          >
            Read →
          </button>
        </form>
        <p className="mt-4 text-center text-stone-400 text-xs">
          Song lyrics, news articles, Reddit posts, literature
        </p>
        <div className="mt-6">
          <WordCount refreshTrigger={knownCountRefresh} />
        </div>
      </div>
    </div>
  )
}
