import { Command } from 'cmdk'
import { FileText, FolderPlus, Settings as SettingsIcon } from 'lucide-react'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNewNote: () => void
}

export default function CommandPalette({ open, onOpenChange, onNewNote }: CommandPaletteProps) {
  if (!open) return null

  function handleAction(action: string) {
    switch (action) {
      case 'new-note':
        onNewNote()
        break
      case 'new-notebook':
        // Placeholder
        break
      case 'settings':
        // Placeholder
        break
    }
    onOpenChange(false)
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => onOpenChange(false)}
    >
      <Command 
        className="bg-bg-soft border border-gray-700 rounded-xl w-full max-w-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-700">
          <Command.Input 
            placeholder="Type a command or search..."
            className="w-full px-4 py-3 bg-transparent border-none outline-none text-fg placeholder-fg-muted"
          />
        </div>
        <Command.List className="max-h-96 overflow-auto p-2">
          <Command.Empty className="px-4 py-8 text-center text-fg-muted">
            No results found.
          </Command.Empty>
          
          <Command.Group heading="Actions" className="text-fg-muted text-xs px-2 py-2">
            <Command.Item
              onSelect={() => handleAction('new-note')}
              className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-bg text-fg data-[selected=true]:bg-bg"
            >
              <FileText className="w-4 h-4" />
              <span>New Note</span>
              <span className="ml-auto text-xs text-fg-muted">Cmd+N</span>
            </Command.Item>
            
            <Command.Item
              onSelect={() => handleAction('new-notebook')}
              className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-bg text-fg data-[selected=true]:bg-bg"
            >
              <FolderPlus className="w-4 h-4" />
              <span>New Notebook</span>
            </Command.Item>
            
            <Command.Item
              onSelect={() => handleAction('settings')}
              className="flex items-center gap-3 px-3 py-2 rounded cursor-pointer hover:bg-bg text-fg data-[selected=true]:bg-bg"
            >
              <SettingsIcon className="w-4 h-4" />
              <span>Settings</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  )
}
