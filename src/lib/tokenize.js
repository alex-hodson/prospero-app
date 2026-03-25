// Splits text into array of token objects: { type: 'word'|'space'|'punct', value: string }
export function tokenize(text) {
  // Split on word boundaries, preserving spaces and punctuation
  const parts = text.split(/(\s+|[.,!?;:'"¿¡\-–—()[\]{}]+)/)
  return parts
    .filter(p => p.length > 0)
    .map(part => {
      if (/^\s+$/.test(part)) return { type: 'space', value: part }
      if (/^[^\wáéíóúüñÁÉÍÓÚÜÑ]+$/.test(part)) return { type: 'punct', value: part }
      return { type: 'word', value: part }
    })
    .filter(t => t.value.length > 0)
}
