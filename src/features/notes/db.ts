import Dexie, { Table } from 'dexie'
import type { Note, Notebook, Revision, Attachment } from './types'

class NotesDB extends Dexie {
  notes!: Table<Note, string>
  notebooks!: Table<Notebook, string>
  revisions!: Table<Revision, string>
  attachments!: Table<Attachment, string>
  
  constructor() {
    super('notes-db-v1')
    this.version(1).stores({
      notes: '&id, notebookId, updatedAt, createdAt, *tags, title, plaintext',
      notebooks: '&id, name, createdAt',
      revisions: '&id, noteId, at',
      attachments: '&id, noteId, name, size'
    })
  }
}

export const db = new NotesDB()
