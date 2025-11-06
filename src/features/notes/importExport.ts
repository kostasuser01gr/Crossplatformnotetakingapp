import { db } from './db'
import type { Note, Notebook } from './types'

export async function exportAsMarkdown(noteId: string): Promise<string> {
  const note = await db.notes.get(noteId)
  if (!note) throw new Error('Note not found')
  
  return `# ${note.title}\n\n${note.plaintext}`
}

export async function exportAsJSON(): Promise<string> {
  const notes = await db.notes.toArray()
  const notebooks = await db.notebooks.toArray()
  
  return JSON.stringify({ notes, notebooks }, null, 2)
}

export async function exportAsZIP(): Promise<Blob> {
  // Simplified ZIP export - in production would use JSZip library
  const json = await exportAsJSON()
  return new Blob([json], { type: 'application/json' })
}

export async function importFromJSON(jsonStr: string) {
  const data = JSON.parse(jsonStr) as { notes?: Note[]; notebooks?: Notebook[] }
  
  if (data.notebooks) {
    await db.notebooks.bulkAdd(data.notebooks)
  }
  
  if (data.notes) {
    await db.notes.bulkAdd(data.notes)
  }
}

export async function importFromMarkdown(markdown: string, notebookId: string) {
  const lines = markdown.split('\n')
  const title = lines[0]?.replace(/^#\s*/, '') || 'Untitled'
  const plaintext = lines.slice(1).join('\n').trim()
  
  const id = crypto.randomUUID()
  const now = Date.now()
  
  await db.notes.add({
    id,
    notebookId,
    title,
    plaintext,
    content: { type: 'doc', content: [] },
    tags: [],
    createdAt: now,
    updatedAt: now
  })
  
  return id
}
