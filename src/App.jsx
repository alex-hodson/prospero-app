import { useState } from 'react'
import TextInput from './components/TextInput'
import Reader from './components/Reader'
import TranslationPopup from './components/TranslationPopup'
import WordList from './components/WordList'
import Library from './components/Library'

export default function App() {
  const [currentText, setCurrentText] = useState(null)
  const [tappedWord, setTappedWord] = useState(null)
  const [sessionMarks, setSessionMarks] = useState(0)
  const [knownCountRefresh, setKnownCountRefresh] = useState(0)
  const [view, setView] = useState('home') // 'home' | 'reader' | 'words' | 'library'

  const handleKnownWord = () => setKnownCountRefresh(k => k + 1)

  const handleRead = (text) => {
    setCurrentText(text)
    setView('reader')
  }

  // Word list view
  if (view === 'words') {
    return <WordList onBack={() => setView('home')} />
  }

  // Library view
  if (view === 'library') {
    return (
      <Library
        onBack={() => setView('home')}
        onSelect={(text) => { handleRead(text.text) }}
      />
    )
  }

  // Reader view
  if (view === 'reader' && currentText) {
    return (
      <>
        <Reader
          text={currentText}
          sessionMarks={sessionMarks}
          onSessionMark={() => setSessionMarks(m => m + 1)}
          knownCountRefresh={knownCountRefresh}
          onBack={() => { setView('home'); setCurrentText(null); setTappedWord(null) }}
          onWordTap={(word, refreshFn, currentState) => setTappedWord({ word, refreshFn, currentState })}
        />
        {tappedWord && (
          <TranslationPopup
            word={tappedWord.word}
            currentState={tappedWord.currentState}
            onStateChange={tappedWord.refreshFn}
            onKnownWord={handleKnownWord}
            onDismiss={() => setTappedWord(null)}
          />
        )}
      </>
    )
  }

  // Home
  return (
    <TextInput
      onRead={handleRead}
      onShowWords={() => setView('words')}
      onShowLibrary={() => setView('library')}
      knownCountRefresh={knownCountRefresh}
    />
  )
}
