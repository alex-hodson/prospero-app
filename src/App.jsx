import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import TextInput from './components/TextInput'
import Reader from './components/Reader'
import TranslationPopup from './components/TranslationPopup'

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [currentText, setCurrentText] = useState(null)
  const [tappedWord, setTappedWord] = useState(null)
  const [sessionMarks, setSessionMarks] = useState(0)
  const [knownCountRefresh, setKnownCountRefresh] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleKnownWord = () => setKnownCountRefresh(k => k + 1)

  // Loading
  if (session === undefined) {
    return <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <p className="text-stone-400 text-sm">Loading...</p>
    </div>
  }

  // Not logged in
  if (!session) return <Auth />

  // Logged in
  if (!currentText) {
    return (
      <TextInput
        onRead={setCurrentText}
        knownCountRefresh={knownCountRefresh}
      />
    )
  }

  return (
    <>
      <Reader
        text={currentText}
        sessionMarks={sessionMarks}
        onSessionMark={() => setSessionMarks(m => m + 1)}
        knownCountRefresh={knownCountRefresh}
        onBack={() => { setCurrentText(null); setTappedWord(null) }}
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
