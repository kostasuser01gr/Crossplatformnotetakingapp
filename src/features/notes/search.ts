import MiniSearch from 'minisearch'
import type { Note } from './types'

let mini: MiniSearch<Note> | null = null

export function buildIndex(notes: Note[]) {
  mini = new MiniSearch({ 
    fields: ['title', 'plaintext', 'tags'], 
    storeFields: ['id', 'title'] 
  })
  mini.addAll(notes)
}

export function search(q: string) {
  if (!mini) return []
  return mini.search(q)
}

export function addToIndex(note: Note) {
  if (!mini) return
  mini.add(note)
}

export function updateInIndex(note: Note) {
  if (!mini) return
  mini.discard(note.id)
  mini.add(note)
}

export function removeFromIndex(noteId: string) {
  if (!mini) return
  mini.discard(noteId)
}
