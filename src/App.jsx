import { useState } from 'react'
import TextInput from './components/TextInput'
import Reader from './components/Reader'
import TranslationPopup from './components/TranslationPopup'

export default function App() {
  const [currentText, setCurrentText] = useState(null)
  const [tappedWord, setTappedWord] = useState(null)
  const [sessionMarks, setSessionMarks] = useState(0)

  if (!currentText) {
    return <TextInput onRead={setCurrentText} />
  }

  return (
    <>
      <Reader
        text={currentText}
        sessionMarks={sessionMarks}
        onSessionMark={() => setSessionMarks(m => m + 1)}
        onBack={() => { setCurrentText(null); setTappedWord(null) }}
        onWordTap={(word, refreshFn, currentState) => setTappedWord({ word, refreshFn, currentState })}
      />
      {tappedWord && (
        <TranslationPopup
          word={tappedWord.word}
          currentState={tappedWord.currentState}
          onStateChange={tappedWord.refreshFn}
          onDismiss={() => setTappedWord(null)}
        />
      )}
    </>
  )
}
