// Translate a single word/phrase from Spanish to English via DeepL free API
export async function translate(text) {
  const apiKey = import.meta.env.VITE_DEEPL_API_KEY
  // DeepL free API endpoint (note: free tier uses api-free.deepl.com)
  const res = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth_key: apiKey,
      text,
      source_lang: 'ES',
      target_lang: 'EN'
    })
  })
  if (!res.ok) throw new Error('DeepL API error')
  const data = await res.json()
  return data.translations[0].text
}