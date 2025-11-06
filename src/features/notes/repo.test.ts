import { describe, it, expect, beforeEach } from 'vitest'
import { db } from './db'
import { createNotebook, createNote, listNotes, updateNote } from './repo'

describe('Notes Repository', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.notes.clear()
    await db.notebooks.clear()
  })

  it('should create a notebook', async () => {
    const id = await createNotebook('Test Notebook')
    expect(id).toBeTruthy()
    
    const notebooks = await db.notebooks.toArray()
    expect(notebooks).toHaveLength(1)
    expect(notebooks[0]?.name).toBe('Test Notebook')
  })

  it('should create a note', async () => {
    const notebookId = await createNotebook('Test Notebook')
    const noteId = await createNote(notebookId, 'Test Note')
    
    expect(noteId).toBeTruthy()
    
    const notes = await listNotes(notebookId)
    expect(notes).toHaveLength(1)
    expect(notes[0]?.title).toBe('Test Note')
  })

  it('should update a note', async () => {
    const notebookId = await createNotebook('Test Notebook')
    const noteId = await createNote(notebookId, 'Test Note')
    
    await updateNote(noteId, { title: 'Updated Title', plaintext: 'Updated content' })
    
    const note = await db.notes.get(noteId)
    expect(note?.title).toBe('Updated Title')
    expect(note?.plaintext).toBe('Updated content')
  })

  it('should list notes for a notebook', async () => {
    const notebook1 = await createNotebook('Notebook 1')
    const notebook2 = await createNotebook('Notebook 2')
    
    await createNote(notebook1, 'Note 1')
    await createNote(notebook1, 'Note 2')
    await createNote(notebook2, 'Note 3')
    
    const notes1 = await listNotes(notebook1)
    const notes2 = await listNotes(notebook2)
    
    expect(notes1).toHaveLength(2)
    expect(notes2).toHaveLength(1)
  })
})
