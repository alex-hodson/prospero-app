// Translate a single word/phrase from Spanish to English via local proxy
export async function translate(text) {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  })
  if (!res.ok) throw new Error('Translation error')
  const data = await res.json()
  return data.translations[0].text
}