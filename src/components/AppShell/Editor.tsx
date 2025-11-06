import { useEffect, useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered, Code } from 'lucide-react'
import type { Note } from '../../features/notes/types'
import { updateNote } from '../../features/notes/repo'

interface EditorProps {
  note?: Note
  onUpdate?: (note: Note) => void
}

export default function Editor({ note, onUpdate }: EditorProps) {
  const [title, setTitle] = useState('')
  
  const editor = useEditor({
    extensions: [StarterKit],
    content: note?.content ?? { type: 'doc', content: [] },
    onUpdate: ({ editor }) => {
      if (!note) return
      
      const content = editor.getJSON()
      const plaintext = editor.getText()
      
      updateNote(note.id, { 
        content, 
        plaintext,
        title 
      }).then(() => {
        onUpdate?.(note)
      })
    }
  })

  // Update editor when note changes
  useEffect(() => {
    if (!note || !editor) return
    
    setTitle(note.title)
    editor.commands.setContent(note.content ?? { type: 'doc', content: [] })
  }, [note, editor])

  useEffect(() => {
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!note) {
    return (
      <div className="flex items-center justify-center h-screen text-fg-muted">
        <div className="text-center">
          <p className="text-lg">Select a note to start editing</p>
          <p className="text-sm mt-2">or press Cmd/Ctrl+N to create a new one</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* Toolbar */}
      <div className="border-b border-gray-800 p-4 flex items-center gap-2">
        <button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-bg-soft ${
            editor?.isActive('bold') ? 'bg-bg-soft text-primary' : 'text-fg-muted'
          }`}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-bg-soft ${
            editor?.isActive('italic') ? 'bg-bg-soft text-primary' : 'text-fg-muted'
          }`}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className={`p-2 rounded hover:bg-bg-soft ${
            editor?.isActive('code') ? 'bg-bg-soft text-primary' : 'text-fg-muted'
          }`}
          title="Code (Cmd+E)"
        >
          <Code className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-gray-800 mx-2" />
        <button
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-bg-soft ${
            editor?.isActive('bulletList') ? 'bg-bg-soft text-primary' : 'text-fg-muted'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-bg-soft ${
            editor?.isActive('orderedList') ? 'bg-bg-soft text-primary' : 'text-fg-muted'
          }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>

      {/* Title */}
      <div className="p-6 border-b border-gray-800">
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            if (note) {
              updateNote(note.id, { title: e.target.value })
            }
          }}
          placeholder="Untitled"
          className="w-full text-3xl font-bold bg-transparent border-none outline-none text-fg placeholder-fg-muted"
        />
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto p-6">
        <EditorContent 
          editor={editor} 
          className="prose prose-invert max-w-none text-fg"
        />
      </div>
    </div>
  )
}
