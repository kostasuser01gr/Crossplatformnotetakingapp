import { FileText } from 'lucide-react'
import type { Note } from '../../features/notes/types'

interface NoteListProps {
  notes: Note[]
  selectedNoteId: string | null
  onNoteSelect: (id: string) => void
}

export default function NoteList({ notes, selectedNoteId, onNoteSelect }: NoteListProps) {
  return (
    <div className="bg-bg border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <input
          type="search"
          placeholder="Search notes..."
          className="w-full bg-bg-soft border border-gray-700 rounded px-3 py-2 text-sm text-fg placeholder-fg-muted focus:outline-none focus:border-primary"
        />
      </div>
      
      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No notes yet</p>
            <p className="text-sm mt-2">Create your first note to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {notes.map(note => (
              <button
                key={note.id}
                onClick={() => onNoteSelect(note.id)}
                className={`w-full p-4 text-left transition-colors ${
                  selectedNoteId === note.id
                    ? 'bg-bg-soft border-l-2 border-primary'
                    : 'hover:bg-bg-soft'
                }`}
              >
                <h3 className="font-medium text-fg truncate">{note.title}</h3>
                <p className="text-sm text-fg-muted mt-1 line-clamp-2">
                  {note.plaintext || 'Empty note'}
                </p>
                <p className="text-xs text-fg-muted mt-2">
                  {new Date(note.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
