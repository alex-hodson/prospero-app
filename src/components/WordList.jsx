import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function WordList({ onBack }) {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // 'all' | 'learning' | 'known'

  useEffect(() => {
    loadWords()
  }, [])

  const loadWords = async () => {
    const { data, error } = await supabase
      .from('words')
      .select('word, state, updated_at')
      .eq('language', 'es')
      .order('updated_at', { ascending: false })
    if (!error) setWords(data || [])
    setLoading(false)
  }

  const filtered = filter === 'all' ? words : words.filter(w => w.state === filter)
  const learningCount = words.filter(w => w.state === 'learning').length
  const knownCount = words.filter(w => w.state === 'known').length

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="sticky top-0 bg-amber-50 border-b border-stone-200 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="text-stone-500 text-sm font-medium py-2 pr-4">← Back</button>
        <h2 className="text-stone-800 font-serif text-lg">My Words</h2>
        <div className="w-16" />
      </div>

      {/* Stats */}
      <div className="flex gap-3 px-4 pt-4">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-colors ${
            filter === 'all' ? 'bg-stone-800 text-amber-50' : 'bg-white border border-stone-200 text-stone-600'
          }`}
        >
          All ({words.length})
        </button>
        <button
          onClick={() => setFilter('learning')}
          className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-colors ${
            filter === 'learning' ? 'bg-yellow-200 text-yellow-800' : 'bg-white border border-stone-200 text-stone-600'
          }`}
        >
          Learning ({learningCount})
        </button>
        <button
          onClick={() => setFilter('known')}
          className={`flex-1 py-3 rounded-xl text-center text-sm font-medium transition-colors ${
            filter === 'known' ? 'bg-green-200 text-green-800' : 'bg-white border border-stone-200 text-stone-600'
          }`}
        >
          Known ({knownCount})
        </button>
      </div>

      {/* Word list */}
      <div className="px-4 py-4">
        {loading && <p className="text-stone-400 text-sm text-center py-8">Loading...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-stone-400 text-sm text-center py-8">
            No words yet. Start reading to build your vocabulary!
          </p>
        )}
        {!loading && filtered.length > 0 && (
          <div className="space-y-1">
            {filtered.map((w, i) => (
              <div key={i} className="flex items-center justify-between py-3 px-3 bg-white rounded-lg border border-stone-100">
                <span className="text-stone-800 font-serif text-base">{w.word}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  w.state === 'learning' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                  {w.state}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
