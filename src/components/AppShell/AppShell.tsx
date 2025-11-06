import { useState, useEffect, useCallback } from 'react'
import Sidebar from './Sidebar'
import NoteList from './NoteList'
import Editor from './Editor'
import CommandPalette from './CommandPalette'
import type { Note, Notebook } from '../../features/notes/types'
import { listNotebooks, listNotes, createNotebook, createNote } from '../../features/notes/repo'
import { buildIndex } from '../../features/notes/search'

export function AppShell() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNotebookId, setSelectedNotebookId] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Load initial data
  useEffect(() => {
    async function loadData() {
      const nbs = await listNotebooks()
      const nts = await listNotes()
      setNotebooks(nbs)
      setNotes(nts)
      
      // Build search index
      buildIndex(nts)
      
      // Auto-create default notebook if none exist
      if (nbs.length === 0) {
        const id = await createNotebook('My Notes')
        const updatedNotebooks = await listNotebooks()
        setNotebooks(updatedNotebooks)
        setSelectedNotebookId(id)
      } else {
        setSelectedNotebookId(nbs[0]?.id ?? null)
      }
    }
    loadData()
  }, [])

  const handleNewNote = useCallback(async () => {
    if (!selectedNotebookId) return
    const id = await createNote(selectedNotebookId)
    const updated = await listNotes(selectedNotebookId)
    setNotes(updated)
    setSelectedNoteId(id)
  }, [selectedNotebookId])

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        handleNewNote()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNewNote])

  async function handleNotebookSelect(notebookId: string) {
    setSelectedNotebookId(notebookId)
    const updated = await listNotes(notebookId)
    setNotes(updated)
    setSelectedNoteId(null)
  }

  function handleNoteSelect(noteId: string) {
    setSelectedNoteId(noteId)
  }

  const selectedNote = notes.find(n => n.id === selectedNoteId)

  return (
    <div className="h-screen grid grid-cols-[280px_340px_1fr] gap-0 bg-bg">
      <Sidebar 
        notebooks={notebooks}
        selectedNotebookId={selectedNotebookId}
        onNotebookSelect={handleNotebookSelect}
        onNewNote={handleNewNote}
      />
      <NoteList 
        notes={notes}
        selectedNoteId={selectedNoteId}
        onNoteSelect={handleNoteSelect}
      />
      <Editor 
        note={selectedNote}
        onUpdate={async () => {
          const updated = await listNotes(selectedNotebookId ?? undefined)
          setNotes(updated)
        }}
      />
      <CommandPalette 
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNewNote={handleNewNote}
      />
    </div>
  )
}

export default AppShell
