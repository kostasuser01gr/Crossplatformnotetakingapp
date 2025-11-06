import { Book, Plus } from 'lucide-react'
import type { Notebook } from '../../features/notes/types'
import { createNotebook } from '../../features/notes/repo'

interface SidebarProps {
  notebooks: Notebook[]
  selectedNotebookId: string | null
  onNotebookSelect: (id: string) => void
  onNewNote: () => void
}

export default function Sidebar({ 
  notebooks, 
  selectedNotebookId, 
  onNotebookSelect,
  onNewNote 
}: SidebarProps) {
  async function handleCreateNotebook() {
    const name = prompt('Notebook name:')
    if (!name) return
    await createNotebook(name)
    window.location.reload() // Simple refresh for now
  }

  return (
    <div className="bg-bg-soft border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold text-fg">Notes</h1>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-medium text-fg-muted">Notebooks</h2>
          <button
            onClick={handleCreateNotebook}
            className="p-1 hover:bg-gray-700 rounded"
            title="New Notebook"
          >
            <Plus className="w-4 h-4 text-fg-muted" />
          </button>
        </div>
        
        <div className="space-y-1">
          {notebooks.map(notebook => (
            <button
              key={notebook.id}
              onClick={() => onNotebookSelect(notebook.id)}
              className={`w-full flex items-center gap-2 p-2 rounded text-left transition-colors ${
                selectedNotebookId === notebook.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-fg hover:bg-gray-700'
              }`}
            >
              <Book className="w-4 h-4" />
              <span className="truncate">{notebook.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button
          onClick={onNewNote}
          className="w-full bg-primary text-bg py-2 px-4 rounded hover:bg-primary/90 transition-colors font-medium"
        >
          New Note
        </button>
      </div>
    </div>
  )
}
