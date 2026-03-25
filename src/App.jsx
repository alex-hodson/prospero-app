import { useState } from 'react'
import TextInput from './components/TextInput'
import Reader from './components/Reader'

export default function App() {
  const [currentText, setCurrentText] = useState(null)
  const [tappedWord, setTappedWord] = useState(null) // { word, refreshFn, position }

  if (!currentText) {
    return <TextInput onRead={setCurrentText} />
  }

  return (
    <>
      <Reader
        text={currentText}
        onBack={() => setCurrentText(null)}
        onWordTap={(word, refreshFn) => setTappedWord({ word, refreshFn })}
      />
      {/* Translation popup coming in T05 */}
      {tappedWord && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-xl shadow-xl p-4 border border-stone-200">
          <p className="text-stone-800 font-medium">{tappedWord.word}</p>
          <p className="text-stone-400 text-sm">Translation coming in T05...</p>
          <button onClick={() => setTappedWord(null)} className="mt-2 text-xs text-stone-400">Dismiss</button>
        </div>
      )}
    </>
  )
}
