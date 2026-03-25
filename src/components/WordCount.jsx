import { useEffect, useState } from 'react'
import { getKnownWordCount } from '../lib/words'

export default function WordCount({ refreshTrigger }) {
  const [count, setCount] = useState(null)

  useEffect(() => {
    getKnownWordCount()
      .then(setCount)
      .catch(() => setCount(null))
  }, [refreshTrigger])

  if (count === null || count === 0) return null

  return (
    <div className="text-center">
      <span className="text-stone-400 text-sm">
        <span className="text-stone-700 font-medium">{count.toLocaleString()}</span>
        {' '}words known
      </span>
    </div>
  )
}
