import { db } from './db'
import type { Note } from './types'

export async function createNotebook(name: string) {
  const id = crypto.randomUUID()
  await db.notebooks.add({ id, name, createdAt: Date.now() })
  return id
}

export async function listNotebooks() {
  return db.notebooks.orderBy('createdAt').reverse().toArray()
}

export async function createNote(notebookId: string, title = 'Untitled') {
  const id = crypto.randomUUID()
  const now = Date.now()
  await db.notes.add({ 
    id, 
    notebookId, 
    title, 
    plaintext: '', 
    content: { type: 'doc', content: [] }, 
    tags: [], 
    createdAt: now, 
    updatedAt: now 
  })
  return id
}

export async function updateNote(id: string, patch: Partial<Note>) {
  patch.updatedAt = Date.now()
  await db.notes.update(id, patch)
}

export async function getNote(id: string) {
  return db.notes.get(id)
}

export async function deleteNote(id: string) {
  await db.notes.update(id, { deleted: true, updatedAt: Date.now() })
}

export async function listNotes(notebookId?: string) {
  if (notebookId) {
    return db.notes.where({ notebookId }).filter(n => !n.deleted).reverse().sortBy('updatedAt')
  }
  return db.notes.filter(n => !n.deleted).reverse().sortBy('updatedAt')
}
