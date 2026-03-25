import { useState } from 'react'
import TextInput from './components/TextInput'

export default function App() {
  const [currentText, setCurrentText] = useState(null)

  if (!currentText) {
    return <TextInput onRead={setCurrentText} />
  }

  // Reader view coming in T04/T05
  return (
    <div className="min-h-screen bg-amber-50 p-4">
      <button onClick={() => setCurrentText(null)} className="text-stone-500 text-sm mb-4">← Back</button>
      <p className="text-stone-400 text-sm">Reader coming soon...</p>
    </div>
  )
}
