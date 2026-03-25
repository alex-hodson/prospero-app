import { supabase } from './supabase'

// Get all word states for current user (returns { word: state } map)
export async function getWordStates() {
  const { data, error } = await supabase
    .from('words')
    .select('word, state')
    .eq('language', 'es')
  if (error) throw error
  return Object.fromEntries(data.map(r => [r.word.toLowerCase(), r.state]))
}

// Upsert a single word state
export async function setWordState(word, state) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('words')
    .upsert({
      user_id: user.id,
      word: word.toLowerCase(),
      language: 'es',
      state,
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id,word,language' })
  if (error) throw error
}

// Get count of known words
export async function getKnownWordCount() {
  const { count, error } = await supabase
    .from('words')
    .select('*', { count: 'exact', head: true })
    .eq('language', 'es')
    .eq('state', 'known')
  if (error) throw error
  return count
}